import { Router } from "express";
import { query } from "../db.js";

export const notesRouter = Router({ mergeParams: true });

// GET /api/leads/:id/notes
notesRouter.get("/:id/notes", async (req, res) => {
  try {
    const leadId = req.params.id;
    const rows = await query(
      "SELECT id, lead_id AS leadId, content, author, created_at AS createdAt FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC",
      [leadId]
    );
    const notes = rows.map((row) => ({
      id: String(row.id),
      leadId: String(row.leadId),
      content: row.content,
      author: row.author,
      timestamp: row.createdAt
        ? new Date(row.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /api/leads/:id/notes
notesRouter.post("/:id/notes", async (req, res) => {
  try {
    const leadId = req.params.id;
    const { content, author } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Note content is required" });
    }
    const [result] = await query(
      "INSERT INTO lead_notes (lead_id, content, author) VALUES (?, ?, ?)",
      [leadId, content.trim(), author || "User"]
    );
    const [row] = await query(
      "SELECT id, lead_id AS leadId, content, author, created_at AS createdAt FROM lead_notes WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({
      id: String(row.id),
      leadId: String(row.leadId),
      content: row.content,
      author: row.author,
      timestamp: row.createdAt
        ? new Date(row.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add note" });
  }
});
