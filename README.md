# Client Lead Management System (Mini CRM)

A simple CRM to manage client leads from website contact forms.

**Tech stack:** React (frontend) · Node.js / Express (backend) · MySQL (database)

---

## Features

- **Lead listing** — Name, email, source, status
- **Lead status updates** — New / Contacted / Converted
- **Notes and follow-ups** — Per-lead notes with author and timestamp
- **Add & edit leads** — Full CRUD with forms and modals
- **Dashboard** — Overview stats and recent leads

*(Secure admin access can be added later as recommended.)*

---

## Project structure

```
Client Lead Management Dashboard/
├── src/                    # React frontend (Vite)
├── server/                 # Node.js API (Express + MySQL)
│   ├── routes/             # leads & notes API
│   ├── db.js
│   ├── schema.sql         # MySQL tables
│   └── .env.example
├── crm-frontend/           # Optional plain HTML/CSS/JS version
├── package.json            # Frontend deps
└── README.md
```

---

## Setup

### 1. MySQL

- Install [MySQL](https://dev.mysql.com/downloads/) and start the server.
- Create the database and run the schema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE lead_management;
USE lead_management;
SOURCE server/schema.sql;
```

Or run the contents of `server/schema.sql` in MySQL Workbench / any MySQL client.

### 2. Backend (Node.js)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=lead_management
```

Then:

```bash
npm install
npm run dev
```

API runs at **http://localhost:3001**. Health check: http://localhost:3001/api/health

### 3. Frontend (React)

From the **project root** (not inside `server`):

```bash
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** and proxies `/api` to the backend.

---

## Run the full app

1. Start MySQL.
2. In one terminal: `cd server && npm run dev`
3. In another: `npm run dev` (from project root)
4. Open http://localhost:5173 and use the app (e.g. login → Dashboard → Leads).

---

## API (backend)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/leads | List all leads |
| GET | /api/leads/:id | Get one lead |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |
| GET | /api/leads/:id/notes | List notes for lead |
| POST | /api/leads/:id/notes | Add note |

---

## Skills practiced

- CRUD operations
- Backend integration (REST API)
- Database management (MySQL)
- Business workflows (lead pipeline)

---

## License

MIT
