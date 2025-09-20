// index.js — homepage logic
"use strict";

function initIndex() {
  console.log("Homepage loaded ✅");

  // Update footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Handle pinned ads visibility (admin only)
  const role = localStorage.getItem("nb_user_role");
  const pinnedSection = document.getElementById("pinned-ads");
  if (pinnedSection) {
    pinnedSection.style.display = role === "admin" ? "flex" : "none";
  }

  // Load More functionality
  let itemsToShow = 10;
  const loadMoreBtn = document.getElementById("load-more-btn");
  const homeGrid = document.getElementById("home-grid");

  if (loadMoreBtn && homeGrid) {
    const products = getProducts();
    renderGrid(homeGrid, products.slice(0, itemsToShow));

    loadMoreBtn.addEventListener("click", () => {
      itemsToShow += 10;
      renderGrid(homeGrid, products.slice(0, itemsToShow));
      if (itemsToShow >= products.length) {
        loadMoreBtn.style.display = "none";
      }
    });
  }
}
