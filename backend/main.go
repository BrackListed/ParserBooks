package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
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
	http.HandleFunc("/get/work-entry", getWorkEntry)
	http.HandleFunc("/get/maintenance", getMaintenanceEntry)
	http.HandleFunc("/delete/work-entry/{id}", deleteWorkEntry)
	http.HandleFunc("/delete/maintenance-schedule/{id}", deleteMaintenanceEntry)
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

func deleteWorkEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, DELETE")
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
