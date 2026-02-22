import "dotenv/config";
import express from "express";
import cors from "cors";
import { leadsRouter } from "./routes/leads.js";
import { notesRouter } from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

// Mount notes first so /api/leads/:id/notes is matched before /api/leads/:id
app.use("/api/leads", notesRouter);
app.use("/api/leads", leadsRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Lead Management API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
