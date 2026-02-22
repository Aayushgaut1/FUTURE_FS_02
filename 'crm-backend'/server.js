require("dotenv").config();
console.log("DB NAME:", process.env.DB_NAME);
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   DATABASE POOL
=========================== */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

/* ===========================
   LEADS ROUTES
=========================== */

app.get("/api/leads", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM leads");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, phone, company, source } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [result] = await db.query(
      `INSERT INTO leads (name, email, phone, company, source)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, company, source]
    );

    res.json({ message: "Lead Added", id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM leads WHERE id = ?", [req.params.id]);
    res.json({ message: "Lead Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   CLIENTS ROUTES
=========================== */

app.get("/api/clients", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { name, email, company } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Client name required" });
    }

    const [result] = await db.query(
      "INSERT INTO clients (name, email, company) VALUES (?, ?, ?)",
      [name, email, company]
    );

    res.json({ message: "Client Added", id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM clients WHERE id = ?", [req.params.id]);
    res.json({ message: "Client Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   DASHBOARD ROUTE
=========================== */

app.get("/api/dashboard", async (req, res) => {
  try {

    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM leads"
    );

    const [[{ newLeads }]] = await db.query(
      "SELECT COUNT(*) AS newLeads FROM leads WHERE status='New'"
    );

    const [[{ contacted }]] = await db.query(
      "SELECT COUNT(*) AS contacted FROM leads WHERE status='Contacted'"
    );

    const [[{ converted }]] = await db.query(
      "SELECT COUNT(*) AS converted FROM leads WHERE status='Converted'"
    );

    const [sources] = await db.query(
      "SELECT source, COUNT(*) AS count FROM leads GROUP BY source"
    );

    res.json({
      total,
      newLeads,
      contacted,
      converted,
      sources
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   SERVER
=========================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
