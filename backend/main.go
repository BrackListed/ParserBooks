package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"time"

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
	http.HandleFunc("/add/maintenance-schedule", addMaintenanceEntry)
	http.HandleFunc("/add/quotation", addQuotationsEntry)
	http.HandleFunc("/add/accounts-payable", addBillEntry)
	http.HandleFunc("/add/expenses", addExpensesEntry)
	http.HandleFunc("/add/employees", addEmployees)
	http.HandleFunc("/get/work-entry", getWorkEntry)
	http.HandleFunc("/get/maintenance", getMaintenanceEntry)
	http.HandleFunc("/get/quotations", getQuotationsEntry)
	http.HandleFunc("/get/accounts-payable", getBills)
	http.HandleFunc("/get/expenses", getExpenses)
	http.HandleFunc("/get/employees", getEmployees)
	http.HandleFunc("/delete/work-entry/{id}", deleteWorkEntry)
	http.HandleFunc("/delete/maintenance-schedule/{id}", deleteMaintenanceEntry)
	http.HandleFunc("/delete/quotations/{id}", deleteQuotationsEntry)
	http.HandleFunc("/delete/accounts-payable/{id}", deleteBillsEntry)
	http.HandleFunc("/delete/expenses/{id}", deleteExpensesEntry)
	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func addWorkEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
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
	_, err := db.Exec(r.Context(), "INSERT INTO work_entry(user_id, date, worker, project_name, type, hours) VALUES($1, $2, $3, $4, $5, $6)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Date, body.Worker, body.Project, body.Type, body.Hours)
	if err != nil {
		log.Println("Database insertion error ", err)
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func addMaintenanceEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Property  string `json:"property"`
		Client    string `json:"client"`
		Type      string `json:"type"`
		Frequency string `json:"frequency"`
		NextDue   string `json:"nextdue"`
		Assigned  string `json:"assigned"`
		Status    string `json:"status"`
		Notes     string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error encoding ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	_, err := db.Exec(r.Context(), "INSERT INTO maintenance(user_id, property, client, type, frequency, next_due, assigned, status, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Property, body.Client, body.Type, body.Frequency, body.NextDue, body.Assigned, body.Status, body.Notes)
	if err != nil {
		log.Println("Database insertion error: ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func addQuotationsEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Client    string `json:"client"`
		Date      string `json:"date"`
		Project   string `json:"project"`
		Status    string `json:"status"`
		Amount    int    `json:"amount"`
		Reference string `json:"reference"`
		SentVia   string `json:"sentVia"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		Notes     string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error decoding ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	_, err := db.Exec(r.Context(), "INSERT INTO quotations(user_id, date, project, status, amount, reference, sent_via, notes, client, phone, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Date, body.Project, body.Status, body.Amount, body.Reference, body.SentVia, body.Notes, body.Client, body.Phone, body.Email)
	if err != nil {
		log.Println("Error inserting into db ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func addBillEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Due         string `json:"dueDate"`
		Supplier    string `json:"supplier"`
		Description string `json:"description"`
		Amount      int    `json:"amount"`
		Priority    string `json:"priority"`
		Status      string `json:"status"`
		PaidDate    string `json:"paidDate"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error decoding body: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	_, err := db.Exec(r.Context(), "INSERT INTO bills(user_id, due, supplier, description, amount, priority, status, paid_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Due, body.Supplier, body.Description, body.Amount, body.Priority, body.Status, body.PaidDate)
	if err != nil {
		log.Println("Error inserting into db: ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func addExpensesEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Date        string  `json:"date"`
		Project     string  `json:"project"`
		Category    string  `json:"category"`
		Supplier    string  `json:"supplier"`
		Description string  `json:"description"`
		Amount      float64 `json:"amount"`
		GstType     string  `json:"gstType"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error decoding body: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	var ex_gst, inc_gst, gst float64
	if body.GstType == "Ex GST" {
		ex_gst = math.Round(body.Amount*100) / 100
		gst = math.Round((body.Amount*0.1)*100) / 100
		inc_gst = math.Round((ex_gst+gst)*100) / 100
	} else {
		inc_gst = math.Round(body.Amount*100) / 100
		ex_gst = math.Round((body.Amount/1.1)*100) / 100
		gst = math.Round((inc_gst-ex_gst)*100) / 100
	}
	_, err := db.Exec(r.Context(), "INSERT INTO expenses(user_id, date, project, category, supplier, description, gst_type, ex_gst, inc_gst, gst) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Date, body.Project, body.Category, body.Supplier, body.Description, body.GstType, ex_gst, inc_gst, gst)
	if err != nil {
		log.Println("Error inserting to the db: ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func addEmployees(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var body struct {
		Employee   string  `json:"employee"`
		NormalRate float64 `json:"normalRate"`
		OTRate     float64 `json:"otRate"`
		Payg       int     `json:"payg"`
		Super      int     `json:"super"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Println("Error decoding: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	if _, err := db.Exec(r.Context(), "INSERT INTO employees(user_id, employee, normal_rate, ot_rate, payg, super) VALUES($1, $2, $3, $4, $5, $6)", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5", body.Employee, body.NormalRate, body.OTRate, body.Payg, body.Super); err != nil {
		log.Println("Error inserting into table employees: ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func deleteWorkEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	id := r.PathValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM work_entry WHERE id = $1", id)
	if err != nil {
		println("Error deleting work entry from db", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func deleteMaintenanceEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	id := r.PathValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM maintenance WHERE id = $1", id)
	if err != nil {
		println("Error deleting maintenance entry from db ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func deleteQuotationsEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	id := r.PathValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM quotations WHERE id = $1", id)
	if err != nil {
		log.Println("Error deleting quotations from db: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func deleteBillsEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Header", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	id := r.PathValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM bills WHERE id = $1", id)
	if err != nil {
		log.Println("Error deleting from accounts payable: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func deleteExpensesEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	id := r.PathValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM expenses WHERE id = $1", id)
	if err != nil {
		log.Println("Error deleting from db: ", err.Error())
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func getMaintenanceEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	type MaintenanceEntry struct {
		ID        string `json:"id"`
		UserID    string `json:"user_id"`
		Property  string `json:"property"`
		Client    string `json:"client"`
		Type      string `json:"type"`
		Frequency string `json:"frequency"`
		NextDue   string `json:"next_due"`
		Assigned  string `json:"assigned"`
		Status    string `json:"status"`
		Notes     string `json:"notes"`
		UpdatedAt string `json:"updated_at"`
	}
	rows, err := db.Query(r.Context(), "SELECT id, user_id, property, client, type, frequency, next_due, assigned, status, notes FROM maintenance WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	entries := []MaintenanceEntry{}
	for rows.Next() {
		var e MaintenanceEntry
		rows.Scan(&e.ID, &e.UserID, &e.Property, &e.Client, &e.Type, &e.Frequency, &e.NextDue, &e.Assigned, &e.Status, &e.Notes)
		entries = append(entries, e)
	}
	defer rows.Close()
	json.NewEncoder(w).Encode(entries)
}

func getWorkEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	type WorkEntry struct {
		ID        string    `json:"id"`
		UserID    string    `json:"user_id"`
		Date      time.Time `json:"date"`
		Worker    string    `json:"worker"`
		Project   string    `json:"project_name"`
		Type      string    `json:"type"`
		Hours     int       `json:"hours"`
		UpdatedAt time.Time `json:"updated_at"`
	}
	rows, err := db.Query(r.Context(), "SELECT id, user_id, date, worker, project_name, type, hours, updated_at FROM work_entry WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		http.Error(w, err.Error(), 400)
		println("Error with getting work entries: query ", err.Error())
		return
	}
	entries := []WorkEntry{}
	for rows.Next() {
		var e WorkEntry
		if err := rows.Scan(&e.ID, &e.UserID, &e.Date, &e.Worker, &e.Project, &e.Type, &e.Hours, &e.UpdatedAt); err != nil {
			println("Error with getting work entries: scan ", err.Error())
		}
		entries = append(entries, e)
	}
	defer rows.Close()
	json.NewEncoder(w).Encode(entries)
}

func getQuotationsEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	type QuotationsEntry struct {
		ID        string    `json:"id"`
		UserID    string    `json:"user_id"`
		Date      string    `json:"date"`
		Project   string    `json:"project"`
		Status    string    `json:"status"`
		Amount    int       `json:"amount"`
		Reference string    `json:"reference"`
		SentVia   string    `json:"sent_via"`
		Notes     string    `json:"notes"`
		Client    string    `json:"client"`
		Phone     string    `json:"phone"`
		Email     string    `json:"email"`
		UpdatedAt time.Time `json:"updated_at"`
	}
	rows, err := db.Query(r.Context(), "SELECT id, user_id, date, project, status, amount, reference, sent_via, notes, client, phone, email, updated_at FROM quotations WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Println("Error getting data from database: ", err.Error())
		return
	}
	entries := []QuotationsEntry{}
	for rows.Next() {
		var e QuotationsEntry
		if err := rows.Scan(&e.ID, &e.UserID, &e.Date, &e.Project, &e.Status, &e.Amount, &e.Reference, &e.SentVia, &e.Notes, &e.Client, &e.Phone, &e.Email, &e.UpdatedAt); err != nil {
			log.Println("Error scanning rows: ", err.Error())
		}
		entries = append(entries, e)
	}
	defer rows.Close()
	json.NewEncoder(w).Encode(entries)
}

func getBills(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	type billsEntry struct {
		ID          string    `json:"id"`
		UserID      string    `json:"user_id"`
		Due         string    `json:"due"`
		Supplier    string    `json:"supplier"`
		Description string    `json:"description"`
		Amount      int       `json:"amount"`
		Priority    string    `json:"priority"`
		Status      string    `json:"status"`
		PaidDate    string    `json:"paid_date"`
		UpdatedAt   time.Time `json:"updated_at"`
	}
	rows, err := db.Query(r.Context(), "SELECT id, user_id, due, supplier, description, amount, priority, status, paid_date, updated_at FROM bills WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		log.Println("Error querying db: ", err.Error())
		http.Error(w, err.Error(), 500)
		return
	}
	entries := []billsEntry{}
	for rows.Next() {
		var e billsEntry
		if err := rows.Scan(&e.ID, &e.UserID, &e.Due, &e.Supplier, &e.Description, &e.Amount, &e.Priority, &e.Status, &e.PaidDate, &e.UpdatedAt); err != nil {
			log.Println("Error scanning rows: ", err.Error())
		}
		entries = append(entries, e)
	}
	defer rows.Close()
	json.NewEncoder(w).Encode(entries)
}

func getExpenses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	type expensesType struct {
		ID          string    `json:"id"`
		UserID      string    `json:"user_id"`
		Date        string    `json:"date"`
		Project     string    `json:"project"`
		Category    string    `json:"category"`
		Supplier    string    `json:"supplier"`
		Description string    `json:"description"`
		GstType     string    `json:"gst_type"`
		UpdatedAt   time.Time `json:"updated_at"`
		ExGST       float64   `json:"ex_gst"`
		GST         float64   `json:"gst"`
		IncGST      float64   `json:"inc_gst"`
	}
	entries := []expensesType{}
	rows, err := db.Query(r.Context(), "SELECT id, user_id, date, project, category, supplier, description, gst_type, updated_at, ex_gst, gst, inc_gst FROM expenses WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		log.Println("Error retrieving data: ", err.Error())
		http.Error(w, err.Error(), 500)
	}
	for rows.Next() {
		var e expensesType
		if err := rows.Scan(&e.ID, &e.UserID, &e.Date, &e.Project, &e.Category, &e.Supplier, &e.Description, &e.GstType, &e.UpdatedAt, &e.ExGST, &e.GST, &e.IncGST); err != nil {
			log.Println("Error scanning data: ", err.Error())
		}
		entries = append(entries, e)
	}
	defer rows.Close()
	json.NewEncoder(w).Encode(entries)
}

func getEmployees(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	type employeeType struct {
		ID         string  `json:"id"`
		UserID     string  `json:"user_id"`
		Employee   string  `json:"employee"`
		NormalRate float64 `json:"normal_rate"`
		OTRate     float64 `json:"ot_rate"`
		Payg       int     `json:"payg"`
		Super      int     `json:"super"`
	}
	rows, err := db.Query(r.Context(), "SELECT id, employee, normal_rate, ot_rate, payg, super FROM employees WHERE user_id = $1", "ab22cf42-f2d6-401d-b3a8-5320f67bbbf5")
	if err != nil {
		log.Println("Error retrieving data from the db: ", err.Error())
		http.Error(w, err.Error(), 500)
	}
	var entries = []employeeType{}
	for rows.Next() {
		var e employeeType
		if err := rows.Scan(&e.ID, &e.Employee, &e.NormalRate, &e.OTRate, &e.Payg, &e.Super); err != nil {
			log.Println("Error scanning rows: ", err.Error())
		}
		entries = append(entries, e)
	}
	json.NewEncoder(w).Encode(entries)
}
