const API_BASE = "http://localhost:3000/api";

/* ===============================
   DOM READY
================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Load dashboard immediately
  loadDashboard();

  // ===== NAVIGATION =====
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", function () {

      document.querySelectorAll(".nav-item")
        .forEach(btn => btn.classList.remove("active"));

      this.classList.add("active");

      const page = this.getAttribute("data-page");

      showSection(page);

      // Correct variable usage
      if (page === "dashboard") loadDashboard();
    });
  });

  // ===== FORM LISTENERS =====
  const leadForm = document.getElementById("addLeadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", addLead);
  }

  const clientForm = document.getElementById("addClientForm");
  if (clientForm) {
    clientForm.addEventListener("submit", addClient);
  }

});


/* ===============================
   SECTION SWITCHING
================================= */

function showSection(sectionId) {

  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
    sec.classList.remove("active");
  });

  const activeSection = document.getElementById(sectionId);

  if (activeSection) {
    activeSection.style.display = "block";
    activeSection.classList.add("active");
  }

  // Update page title
  const title = document.getElementById("page-title");
  if (title) {
    title.innerText =
      sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  }

  if (sectionId === "leads") loadLeads();
  if (sectionId === "clients") loadClients();
}


/* ===============================
   DASHBOARD
================================= */

async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    const data = await res.json();

    // Safety checks
    if (!data) return;

    const totalEl = document.getElementById("totalLeads");
    const newEl = document.getElementById("newLeads");
    const contactedEl = document.getElementById("contactedLeads");
    const convertedEl = document.getElementById("convertedLeads");

    if (totalEl) totalEl.innerText = data.total || 0;
    if (newEl) newEl.innerText = data.newLeads || 0;
    if (contactedEl) contactedEl.innerText = data.contacted || 0;
    if (convertedEl) convertedEl.innerText = data.converted || 0;

    const sourceContainer = document.getElementById("sourceList");
    if (!sourceContainer) return;

    sourceContainer.innerHTML = "";

    // Prevent division by zero
    const total = data.total > 0 ? data.total : 1;

    if (data.sources && data.sources.length > 0) {
      data.sources.forEach(source => {

        const percent = (source.count / total) * 100;

        sourceContainer.innerHTML += `
          <div class="source-row">
            <div class="source-top">
              <span>${source.source || "Unknown"}</span>
              <span>${source.count}</span>
            </div>
            <div class="source-bar">
              <div class="source-bar-fill" 
                   style="width:${percent}%"></div>
            </div>
          </div>
        `;
      });
    } else {
      sourceContainer.innerHTML = "<p>No source data available</p>";
    }

  } catch (err) {
    console.error("Dashboard load error:", err);
  }
}


/* ===============================
   LEADS
================================= */

async function loadLeads() {
  try {
    const res = await fetch(`${API_BASE}/leads`);
    const data = await res.json();

    const tbody = document.querySelector("#leadsTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(lead => {
      tbody.innerHTML += `
        <tr>
          <td>${lead.name}</td>
          <td>${lead.email || ""}</td>
          <td>${lead.phone || ""}</td>
          <td>${lead.status || "New"}</td>
          <td>
            <button onclick="deleteLead(${lead.id})">Delete</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error loading leads:", err);
  }
}

async function addLead(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("leadName").value,
    email: document.getElementById("leadEmail").value,
    phone: document.getElementById("leadPhone").value
  };

  try {
    await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    closeModal("addLeadModal");
    e.target.reset();
    loadLeads();
    loadDashboard(); // refresh stats

  } catch (err) {
    console.error("Error adding lead:", err);
  }
}

async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;

  try {
    await fetch(`${API_BASE}/leads/${id}`, {
      method: "DELETE"
    });

    loadLeads();
    loadDashboard(); // refresh stats

  } catch (err) {
    console.error("Error deleting lead:", err);
  }
}


/* ===============================
   CLIENTS
================================= */

async function loadClients() {
  try {
    const res = await fetch(`${API_BASE}/clients`);
    const data = await res.json();

    const tbody = document.querySelector("#clientsTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(client => {
      tbody.innerHTML += `
        <tr>
          <td>${client.name}</td>
          <td>${client.email || ""}</td>
          <td>${client.company || ""}</td>
          <td>
            <button onclick="deleteClient(${client.id})">Delete</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error loading clients:", err);
  }
}

async function addClient(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("clientName").value,
    email: document.getElementById("clientEmail").value,
    company: document.getElementById("clientCompany").value
  };

  try {
    await fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    closeModal("addClientModal");
    e.target.reset();
    loadClients();

  } catch (err) {
    console.error("Error adding client:", err);
  }
}

async function deleteClient(id) {
  if (!confirm("Delete this client?")) return;

  try {
    await fetch(`${API_BASE}/clients/${id}`, {
      method: "DELETE"
    });

    loadClients();

  } catch (err) {
    console.error("Error deleting client:", err);
  }
}


/* ===============================
   MODALS
================================= */

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
