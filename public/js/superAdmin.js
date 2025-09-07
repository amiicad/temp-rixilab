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