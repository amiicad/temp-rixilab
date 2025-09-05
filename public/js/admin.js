
  // ===== Batch filter =====
  const batchFilter = document.getElementById("batchFilter");
  batchFilter.addEventListener("change", () => {
    const selectedBatch = batchFilter.value;
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => {
      card.style.display = (selectedBatch === "all" || card.dataset.batch === selectedBatch) ? "block" : "none";
    });
  });

 
const sidebarLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.main-content section');

sidebarLinks.forEach(link => {
  const href = link.getAttribute('href');

  if (href.startsWith("#")) {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = href.substring(1);
      sections.forEach(sec => sec.style.display = 'none');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.style.display = 'block';
    });
  }
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
  // project review batch filtering
function filterReviewProjectsByBatch() {
  const selectedBatch = document.getElementById('batchFilter').value;
  document.querySelectorAll('.project-card').forEach(card => {
    const batch = card.getAttribute('data-batch');
    if (selectedBatch === 'all' || batch === selectedBatch) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
  // Show all projects on page load
  document.addEventListener("DOMContentLoaded", filterReviewProjectsByBatch);

  // Run once on page load to hide all
  window.addEventListener('DOMContentLoaded', (event) => {
    filterByBatch();
  });
  
