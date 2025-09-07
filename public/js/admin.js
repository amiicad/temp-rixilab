// const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
// const sections = document.querySelectorAll('.main-content section');

// // Initially show only dashboard
// sections.forEach(sec => {
//   sec.style.display = sec.id === 'dashboard' ? 'block' : 'none';
// });

// sidebarLinks.forEach(link => {
//   link.addEventListener('click', e => {
//     e.preventDefault();
//     const targetId = link.getAttribute('href').substring(1);

//     // Hide all sections, including dashboard
//     sections.forEach(sec => sec.style.display = 'none');

//     // Show only the clicked section
//     const targetSection = document.getElementById(targetId);
//     if (targetSection) targetSection.style.display = 'block';
//   });
// });



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
    const selectedBatch = document.getElementById("projectBatchFilter").value;
    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {
      if (selectedBatch === "all" || card.dataset.batch === selectedBatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
    // Client-side batch filter
  function filterSubmittedProjects(batch) {
    const cards = document.querySelectorAll('#submittedProjects .intern-card');
    cards.forEach(card => {
      const internBatch = card.dataset.batch;
      card.style.display = (batch === 'all' || internBatch === batch) ? 'block' : 'none';
    });
  }

  function applyFilters() {
  let batchFilter = document.getElementById("submittedBatchFilter").value.toLowerCase();
  let internSearch = document.getElementById("internSearch").value.toLowerCase();
  let cards = document.querySelectorAll("#submittedProjects .intern-card");

  cards.forEach(card => {
    let cardBatch = card.getAttribute("data-batch").toLowerCase();
    let internId = card.querySelector(".intern-id")?.textContent.toLowerCase() || "";

    let matchesBatch = (batchFilter === "all" || cardBatch === batchFilter);
    let matchesIntern = (internSearch === "" || internId.includes(internSearch));

    // Show only if BOTH match
    card.style.display = (matchesBatch && matchesIntern) ? "block" : "none";
  });
}

function clearFilters() {
  document.getElementById("submittedBatchFilter").value = "all";
  document.getElementById("internSearch").value = "";
  applyFilters();
}

// Intern Filters
function applyInternFilters() {
  let batchFilter = document.getElementById("batchFilter").value.toLowerCase();
  let internSearch = document.getElementById("internSearch").value.toLowerCase();
  let cards = document.querySelectorAll("#viewInterns .intern-card");

  cards.forEach(card => {
    let cardBatch = card.getAttribute("data-batch").toLowerCase();
    let internId = card.querySelector(".intern-id")?.textContent.toLowerCase() || "";

    let matchesBatch = (batchFilter === "all" || cardBatch === batchFilter);
    let matchesIntern = (internSearch === "" || internId.includes(internSearch));

    card.style.display = (matchesBatch && matchesIntern) ? "block" : "none";
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