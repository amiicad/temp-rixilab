
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



  function toggleConfirmAll() {
    const checked = document.getElementById('selectAllConfirm').checked;
    document.querySelectorAll('.confirmCheckbox').forEach(c => c.checked = checked);
  }
  function toggleCongratsAll() {
    const checked = document.getElementById('selectAllCongrats').checked;
    document.querySelectorAll('.congratsCheckbox').forEach(c => c.checked = checked);
  }

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
function filterProjectsByBatch() {
  const selectedBatch = document.getElementById("projectBatchFilter").value.toLowerCase();
  const rows = document.querySelectorAll("#viewProjects .project-row");

  rows.forEach(row => {
    const rowBatch = row.getAttribute("data-batch").toLowerCase();
    row.style.display = (selectedBatch === "all" || rowBatch === selectedBatch) ? "" : "none";
  });
}





// Intern Filters for Table
function applyInternFilters() {
  let batchFilter = document.getElementById("batchFilter").value.toLowerCase();
  let internSearch = document.getElementById("internSearch").value.toLowerCase();
  let rows = document.querySelectorAll("#viewInterns .intern-row");

  rows.forEach(row => {
    let rowBatch = row.getAttribute("data-batch").toLowerCase();
    let internId = row.querySelector(".intern-id")?.textContent.toLowerCase() || "";

    let matchesBatch = (batchFilter === "all" || rowBatch === batchFilter);
    let matchesIntern = (internSearch === "" || internId.includes(internSearch));

    row.style.display = (matchesBatch && matchesIntern) ? "" : "none";
  });
}

function clearInternFilters() {
  document.getElementById("batchFilter").value = "all";
  document.getElementById("internSearch").value = "";
  applyInternFilters();
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
    filterProjectsByBatch();
    filterSubmittedProjects('<%= currentSubmittedBatch %>');
  });


    // Helper to get the Submitted Projects section
function getSubmittedSection() {
  return document.getElementById('submittedProjects');
}

// Main filter function
function applySubmittedFilters() {
  const section = getSubmittedSection();
  if (!section) return;

  const batchFilter = section.querySelector('#submittedBatchFilter')?.value.toLowerCase() || 'all';
  const internSearch = section.querySelector('#submittedInternSearch')?.value.toLowerCase().trim() || '';

  const cards = section.querySelectorAll('.intern-card');

  cards.forEach(card => {
    const cardBatch = (card.dataset.batch || '').toLowerCase();
    const cardInternId = (card.querySelector('.intern-id')?.textContent || '').toLowerCase().trim();

    const matchesBatch = (batchFilter === 'all' || cardBatch === batchFilter);
    const matchesIntern = (internSearch === '' || cardInternId.includes(internSearch));

    // Show card only if both match
    card.style.display = (matchesBatch && matchesIntern) ? 'block' : 'none';
  });
}

// Clear filters
function clearSubmittedFilters() {
  const section = getSubmittedSection();
  if (!section) return;

  section.querySelector('#submittedBatchFilter').value = 'all';
  section.querySelector('#submittedInternSearch').value = '';
  applySubmittedFilters();
}

// Apply filters on page load
window.addEventListener('DOMContentLoaded', () => {
  applySubmittedFilters(); // ensures all cards are visible by default
});

  // document.addEventListener('DOMContentLoaded', applySubmittedFilters);

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


  // Dashboard
