-- Create database (run once manually if needed: CREATE DATABASE lead_management;)
USE lead_management;

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'Website',
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  last_contacted DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notes for leads
CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT 'User',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Optional: seed a few leads for testing
-- INSERT INTO leads (name, email, phone, company, source, status, last_contacted) VALUES
-- ('Sarah Johnson', 'sarah.j@email.com', '+1 (555) 123-4567', 'Tech Innovations Inc.', 'Website', 'new', '2026-02-07'),
-- ('Michael Chen', 'm.chen@company.com', '+1 (555) 234-5678', 'Digital Solutions LLC', 'Referral', 'contacted', '2026-02-06');
