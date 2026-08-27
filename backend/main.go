package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var db *pgxpool.Pool

func main() {
	var err error
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No ENV string found")
	}
	db, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Failed to connect to db: ", err)
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello, World!")
	})
	defer db.Close()
	http.HandleFunc("/add/work-entry", addWorkEntry)
	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func addWorkEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request!")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Date    string `json:"date"`
		Worker  string `json:"worker"`
		Project string `json:"project"`
		Type    string `json:"type"`
		Hours   int    `json:"hours"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error encoding ", err)
		http.Error(w, err.Error(), 400)
		return
	}
	_, err := db.Exec(r.Context(), "INSERT INTO work_entry(user_id, date, worker, project_name, type, hours) VALUES($1, $2, $3, $4, $5, $6)", uuid.New(), body.Date, body.Worker, body.Project, body.Type, body.Hours)
	if err != nil {
		log.Println("Database insertion error ", err)
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}
