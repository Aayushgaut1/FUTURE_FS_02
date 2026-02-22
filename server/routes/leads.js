import { Router } from "express";
import { query } from "../db.js";

export const leadsRouter = Router();

// GET /api/leads - list all leads
leadsRouter.get("/", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, name, email, phone, company, source, status, last_contacted AS lastContacted, created_at AS createdAt FROM leads ORDER BY created_at DESC"
    );
    const leads = rows.map((row) => ({
      ...row,
      id: String(row.id),
      lastContacted: row.lastContacted ? row.lastContacted.toISOString().slice(0, 10) : null,
    }));
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// GET /api/leads/:id - get one lead
leadsRouter.get("/:id", async (req, res) => {
  try {
    const [row] = await query(
      "SELECT id, name, email, phone, company, source, status, last_contacted AS lastContacted, created_at AS createdAt FROM leads WHERE id = ?",
      [req.params.id]
    );
    if (!row) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({
      ...row,
      id: String(row.id),
      lastContacted: row.lastContacted ? row.lastContacted.toISOString().slice(0, 10) : null,
      createdAt: row.createdAt?.toISOString().slice(0, 10) ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
});

// POST /api/leads - create lead
leadsRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, source, status, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const [result] = await query(
      "INSERT INTO leads (name, email, phone, company, source, status, last_contacted) VALUES (?, ?, ?, ?, ?, ?, CURDATE())",
      [
        name,
        email,
        phone || null,
        company || null,
        source || "Website",
        status || "new",
      ]
    );
    const id = String(result.insertId);
    if (notes && notes.trim()) {
      await query(
        "INSERT INTO lead_notes (lead_id, content, author) VALUES (?, ?, ?)",
        [result.insertId, notes.trim(), "User"]
      );
    }
    const [row] = await query(
      "SELECT id, name, email, phone, company, source, status, last_contacted AS lastContacted, created_at AS createdAt FROM leads WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({
      ...row,
      id: String(row.id),
      lastContacted: row.lastContacted ? row.lastContacted.toISOString().slice(0, 10) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// PUT /api/leads/:id - update lead
leadsRouter.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, company, source, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const [result] = await query(
      "UPDATE leads SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ? WHERE id = ?",
      [name, email, phone || null, company || null, source || "Website", status || "new", req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    const [row] = await query(
      "SELECT id, name, email, phone, company, source, status, last_contacted AS lastContacted, created_at AS createdAt FROM leads WHERE id = ?",
      [req.params.id]
    );
    res.json({
      ...row,
      id: String(row.id),
      lastContacted: row.lastContacted ? row.lastContacted.toISOString().slice(0, 10) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// DELETE /api/leads/:id
leadsRouter.delete("/:id", async (req, res) => {
  try {
    const [result] = await query("DELETE FROM leads WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});
