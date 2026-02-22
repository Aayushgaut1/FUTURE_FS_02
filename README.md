Client Lead Management System (Mini CRM)

A full-stack CRM application to manage and track client leads from website contact forms.

Tech Stack

Frontend: React (Vite)

Backend: Node.js, Express.js

Database: MySQL

Features

Lead listing (name, email, source, status)

Status updates: New → Contacted → Converted

Notes & follow-ups per lead (with timestamp)

Full CRUD operations

Dashboard with overview statistics

Project Structure
Client-Lead-Management-System/
├── src/              # React frontend
├── server/           # Express API + MySQL
│   ├── routes/
│   ├── db.js
│   └── schema.sql
├── package.json
└── README.md
Setup
1. Database

Create database and run schema:

CREATE DATABASE lead_management;
USE lead_management;
SOURCE server/schema.sql;
2. Backend
cd server
cp .env.example .env
npm install
npm run dev
3. Frontend

From project root:

npm install
npm run dev

App runs at:
http://localhost:5173

API Endpoints
Method	Endpoint
GET	/api/leads
POST	/api/leads
PUT	/api/leads/:id
DELETE	/api/leads/:id
GET	/api/leads/:id/notes
POST	/api/leads/:id/notes
Skills Demonstrated

REST API development

Database design (MySQL)

Full-stack integration

CRUD operations

Business workflow implementation
