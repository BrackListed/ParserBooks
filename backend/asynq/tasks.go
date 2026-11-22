package tasks

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	xlsx "github.com/tealeg/xlsx/v3"
	"google.golang.org/genai"
)

const (
	TypeAnalyzeMaterials = "analyze:materials"
)

type geminiPayload struct {
	JoinedRows    string   `json:"joinedRows"`
	ReferenceRows []string `json:"referenceRows"`
	EndRows       []string `json:"endRows"`
	IsVariation   bool     `json:"isVariation"`
	ID            string   `json:"id"`
}

type Materials struct {
	ProductCode string  `json:"product_code"`
	Date        string  `json:"date"`
	Supplier    string  `json:"supplier"`
	Invoice     string  `json:"invoice"`
	Quantity    int     `json:"quantity"`
	Description string  `json:"description"`
	UnitPrice   float64 `json:"unit_price"`
	Total       float64 `json:"total"`
	TotalIncGST bool    `json:"total_inc_gst"`
	Markup      float64 `json:"markup"`
	IsVariation bool    `json:"isVariation"`
}

type MaterialsResponse struct {
	Materials []Materials `json:"materials"`
}

type MaterialsDatabase struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	ProjectID   string    `json:"project_id"`
	Supplier    string    `json:"supplier"`
	Invoice     string    `json:"invoice"`
	ProductCode string    `json:"product_code"`
	Quantity    int       `json:"quantity"`
	Description string    `json:"description"`
	UnitPrice   float64   `json:"unit_price"`
	NetPrice    float64   `json:"net_price"`
	Gst         float64   `json:"gst"`
	Total       float64   `json:"total"`
	Date        time.Time `json:"date"`
	Temporary   bool      `json:"temporary"`
	TemporaryID string    `json:"temporary_id"`
}

func NewMaterialsTask(joinedRows string, referenceRows []string, endRows []string, isVariation bool, id string) { //cus we're gonna pass things into this function
	payload, err := json.Marshal(geminiPayload{
		JoinedRows:    joinedRows,
		ReferenceRows: referenceRows,
		EndRows:       endRows,
		IsVariation:   isVariation,
		ID:            id,
	})
	if err != nil {
		log.Println("Error compiling the payload structs into 1 object in tasks.go: ", err.Error())
	}
	return asynq.NewTask(TypeAnalyzeMaterials, payload), nil
}

func HandleMaterialsTask(ctx context.Context, t *asynq.Task) {
	dbURL := os.Getenv("DOCKER_URL")
	if dbURL == "" {
		dbURL = os.Getenv("DATABASE_URL")
	}
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatal("Failed to connect to db: ", err)
	}
	var p geminiPayload
	if err := godotenv.Load(); err != nil {
		log.Println("ENV failed to load in Extract Materials: ", err.Error())
	}
	var apiKey = os.Getenv("GEMINI_API_KEY")
	ctx = context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatal(err)
	}
	chat, err := client.Chats.Create(ctx, "gemini-3.5-flash-lite", nil, nil)
	if err != nil {
		log.Fatal(err)
	}
	ai_response, err := chat.SendMessage(
		ctx,
		genai.Part{
			// Join the collected strings before concatenating because values is a []string.
			Text: `Extract materials data from a spreadsheet and return it as raw JSON.

INPUT:
- "Spreadsheet Cells": the line items to extract, one non-empty cell per line in the format "Row: r Col: c Value: v".
- "Reference Rows" and "End Rows": context only. Never turn these into entries in the "materials" array.

RULES:
1. Use the header row in "Spreadsheet Cells" to work out which column holds each field.
2. Output exactly one object in "materials" for every data row in "Spreadsheet Cells".
3. Skip header rows, blank rows, and summary rows (subtotals, totals, grand totals).
4. Read "markup" from "Reference Rows" or "End Rows". It is a single overall percentage; apply the same value to every item as a plain number (e.g. 35 or 35.99), without the % sign.
5. "total_inc_gst" is true if the total column header says it includes GST (e.g. "Total Inc GST"), otherwise false. Use the same value for every item.
6. Only fill a field from the column whose header clearly matches it. Never shift, guess, or borrow values from neighbouring columns.
7. If a field is missing, use "" for strings and 0 for numbers. Never output null and never leave out a key.
8. Numbers must be plain JSON numbers: no currency symbols, commas, or quotes.

OUTPUT FORMAT (return exactly this shape and nothing else):
{"materials":[{"product_code":"string","date":"string","supplier":"string","invoice":"string","quantity":integer,"description":"string","unit_price":number,"total":number,"total_inc_gst":bool,"markup":number}]}

Do not wrap the output in Markdown code fences (no ` + "```json" + `). Return raw JSON only.

Reference Rows:
` + strings.Join(p.ReferenceRows, "\n") + `

End Rows:
` + strings.Join(p.EndRows, "\n") + `

Spreadsheet Cells:
` + p.JoinedRows,
		},
	)
	if err != nil {
		log.Println("Error soliciting response from Gemini in Extract Projects: ", err.Error())
	}
	stringMessage := ai_response.Text()
	var response MaterialsResponse
	if err := json.Unmarshal([]byte(stringMessage), &response); err != nil {
		log.Println("Error decoding Gemini response in processMaterials: ", err.Error())
	}
	materials := response.Materials
	for index := range materials {
		date, err := strconv.ParseFloat(materials[index].Date, 64) //converts a string into a float, takes the string then a second value that dictates whether float64 or float32
		if err != nil {
			log.Println("Error converting date into float in processMaterials")
		}
		convertedDate := xlsx.TimeFromExcelTime(date, false) //converts an excel time in float64 into Time.Time, xlsx advised if I don't know whether to use the 1900 or 1904 model then set the second variable to false
		newDate := convertedDate.String()
		materials[index].IsVariation = p.IsVariation
		materials[index].Date = newDate[:10] //turn the time into string
	}
	for index, value := range materials {
		var ex_gst float64
		var id string
		if value.TotalIncGST {
			ex_gst = value.UnitPrice / 1.10
		} else {
			ex_gst = value.UnitPrice
		}
		net_price := ex_gst * float64(value.Quantity)
		gst := net_price * 0.10
		total := net_price + gst
		rows, err := db.Query(ctx, `INSERT INTO materials(user_id, supplier, invoice, product_code, quantity, description, unit_price, net_price, gst, total, date, temporary, temporary_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
		RETURNING supplier, invoice, product_code, quantity, description, unit_price, net_price, gst, total, date, temporary, temporary_id`,
			"ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", value.Supplier, value.Invoice, value.ProductCode, value.Quantity, value.Description, ex_gst, net_price, gst, total, value.Date, true, id)
		if err != nil {
			log.Println("Error retrieving items from the db in HandleMaterialsTask: ", err.Error())
		}
		materials := []MaterialsDatabase{}
		for rows.Next() {
			var e MaterialsDatabase
			rows.Scan(&e.Supplier, &e.Invoice, &e.ProductCode, &e.Quantity, &e.Description, &e.UnitPrice, &e.NetPrice, &e.Gst, &e.Total, &e.Date, &e.Temporary, &e.TemporaryID)
			materials = append(materials, e)
		}
	}
	return materials
}
