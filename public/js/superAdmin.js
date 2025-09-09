const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
const sections = document.querySelectorAll('.main-content section');

// Initially show only dashboard
sections.forEach(sec => {
  sec.style.display = sec.id === 'dashboard' ? 'block' : 'none';
});

sidebarLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);

    // Hide all sections, including dashboard
    sections.forEach(sec => sec.style.display = 'none');

    // Show only the clicked section
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.style.display = 'block';
  });
});
    function filterByBatch() {
    const selectedBatch = document.getElementById("batchFilter").value;
    const cards = document.querySelectorAll(".intern-card");

    cards.forEach(card => {
      if (selectedBatch === "all" || card.dataset.batch === selectedBatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

  // Run once on page load to hide all
  window.addEventListener('DOMContentLoaded', (event) => {
    filterByBatch();
  });

   function applyInternFilters() {
    const batchFilter = document.getElementById("batchFilter").value.toLowerCase();
    const searchValue = document.getElementById("internSearchInput").value.toLowerCase();
    const cards = document.querySelectorAll("#internCardsContainer .intern-card");

    cards.forEach(card => {
      const cardBatch = card.getAttribute("data-batch").toLowerCase();
      const name = card.querySelector(".intern-name").textContent.toLowerCase();
      const internId = card.querySelector(".intern-id").textContent.toLowerCase();

      const matchesBatch = batchFilter === "all" || cardBatch === batchFilter;
      const matchesSearch = name.includes(searchValue) || internId.includes(searchValue);

      card.style.display = (matchesBatch && matchesSearch) ? "block" : "none";
    });
  }

  function clearInternFilters() {
    document.getElementById("batchFilter").value = "all";
    document.getElementById("internSearchInput").value = "";
    applyInternFilters();
  }



  // Function to send mails

  // ✅ Toggle Select All
   // ==========================
// SuperAdmin JS
// ==========================

// Toggle Sidebar for Mobile
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.querySelector(".sidebar");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("d-none");
});

// ==========================
// Select All Checkbox
// ==========================
function toggleSelectAll(type) {
  let checkboxes = document.querySelectorAll("." + type + "Checkbox");
  let master = document.getElementById(
    "selectAll" + (type === "confirm" ? "Confirm" : "Completion")
  );
  checkboxes.forEach(cb => {
    if (cb.closest("tr").style.display !== "none") {
      cb.checked = master.checked;
    }
  });
}

// ==========================
// Apply Filters & Search
// ==========================
function applyFilters(type) {
  let statusFilter = document.getElementById(
    "filter" + (type === "confirm" ? "Confirm" : "Completion")
  ).value;
  let batchFilter = document.getElementById(
    "batch" + (type === "confirm" ? "Confirm" : "Completion")
  ).value;
  let searchTerm = document
    .getElementById(
      "search" + (type === "confirm" ? "Confirm" : "Completion")
    )
    .value.toLowerCase();

  document.querySelectorAll(`#${type}Table tr`).forEach(row => {
    let rowStatus = row.dataset.status;
    let rowBatch = row.dataset.batch;
    let rowName = row.dataset.name.toLowerCase();
    let rowEmail = row.dataset.email.toLowerCase();

    let matchStatus = statusFilter === "all" || rowStatus === statusFilter;
    let matchBatch = batchFilter === "all" || rowBatch === batchFilter;
    let matchSearch =
      !searchTerm || rowName.includes(searchTerm) || rowEmail.includes(searchTerm);

    row.style.display = matchStatus && matchBatch && matchSearch ? "" : "none";

    // Highlight sent mails green
    if (rowStatus === "sent") {
      row.style.backgroundColor = "#d4edda"; // green
    } else {
      row.style.backgroundColor = ""; // default white
    }
  });
}

// ==========================
// Clear Filters
// ==========================
function clearFilters(type) {
  document.getElementById("filter" + (type === "confirm" ? "Confirm" : "Completion")).value = "all";
  document.getElementById("batch" + (type === "confirm" ? "Confirm" : "Completion")).value = "all";
  document.getElementById("search" + (type === "confirm" ? "Confirm" : "Completion")).value = "";
  applyFilters(type);
}

// ==========================
// Send Mails
// ==========================
async function sendMails(type) {
  let checkboxes = document.querySelectorAll("." + type + "Checkbox:checked");
  if (checkboxes.length === 0) {
    alert("Please select at least one intern to send mails.");
    return;
  }

  const selectedIds = Array.from(checkboxes).map(cb => cb.value);

  try {
    const response = await fetch(
      type === "confirm" ? "/send-confirmation-mail" : "/send-completion-mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interns: selectedIds })
      }
    );

    if (response.ok) {
      alert("Mails sent successfully!");
      location.reload();
    } else {
      alert("Error sending mails. Check server logs.");
    }
  } catch (err) {
    console.error("Mail sending failed:", err);
    alert("Server error while sending mails.");
  }
}

async function sendMails(type) {
  const checkboxes = document.querySelectorAll("." + type + "Checkbox:checked");
  const selectedIds = Array.from(checkboxes).map(cb => cb.value);

  if (selectedIds.length === 0) {
    alert("Please select at least one intern");
    return;
  }

  try {
    const response = await fetch(type === "confirm" ? "/send-confirmation-mail" : "/send-completion-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interns: selectedIds }),
    });

    const data = await response.json();
    if (data.success) {
      alert(`✅ ${data.sent} mails sent. ${data.failed} failed.`);
      console.log(`${type} mail results:`, data);
    } else {
      alert(`⚠️ Error: ${data.message}`);
    }
  } catch (err) {
    console.error("Unexpected error while sending mails:", err);
    alert("Unexpected error while sending mails. Check console.");
  }
}


function updateRowColor(checkbox, type) {
  const row = checkbox.closest("tr");
  if (checkbox.checked) {
    row.classList.add("row-selected");
  } else {
    row.classList.remove("row-selected");
  }
}


function toggleSelectAll(type) {
  const table = document.getElementById(type + "Table");
  const checkboxes = table.querySelectorAll("input[type='checkbox']:not([disabled])");
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  const newCheckedState = !allChecked;

  checkboxes.forEach(cb => {
    cb.checked = newCheckedState;
    updateRowColor(cb, type);
  });
}

function applyFilters(type) {
  const filter = document.getElementById("filter" + capitalize(type)).value;
  const batch = document.getElementById("batch" + capitalize(type)).value;
  const search = document.getElementById("search" + capitalize(type)).value.toLowerCase();
  const rows = document.getElementById(type + "Table").querySelectorAll("tr");

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    const rowBatch = row.getAttribute("data-batch");
    const name = row.getAttribute("data-name");
    const email = row.getAttribute("data-email");

    let visible = true;
    if (filter !== "all" && filter !== status) visible = false;
    if (batch !== "all" && batch !== rowBatch) visible = false;
    if (search && !name.includes(search) && !email.includes(search)) visible = false;

    row.style.display = visible ? "" : "none";
  });
}

function clearFilters(type) {
  document.getElementById("filter" + capitalize(type)).value = "all";
  document.getElementById("batch" + capitalize(type)).value = "all";
  document.getElementById("search" + capitalize(type)).value = "";
  applyFilters(type);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  })()