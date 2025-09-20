// index.js — page-specific behaviour for index
"use strict";

function initIndex() {
  console.log("initIndex running");

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const pinnedAdsContainer = document.getElementById("pinned-ads");
  const homeGrid = document.getElementById("home-grid");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // First, get products
  const products = getProducts();

  // Render pinned ads (admin only)
  const current = getCurrentUser();
  if (pinnedAdsContainer) {
    if (current && current.role === "admin") {
      const pinnedIds = getPinned();
      const pinnedProducts = products.filter(p => pinnedIds.includes(String(p.id)));
      if (pinnedProducts.length) {
        renderGrid(pinnedAdsContainer, pinnedProducts);
      } else {
        pinnedAdsContainer.innerHTML = "<p class='muted'>No pinned ads</p>";
      }
    } else {
      pinnedAdsContainer.style.display = "none";
    }
  }

  // Trending + Load More
  let itemsToShow = 6;
  function renderHomeGrid() {
    if (!homeGrid) return;
    const slice = products.slice(0, itemsToShow);
    renderGrid(homeGrid, slice);
    if (loadMoreBtn) {
      if (itemsToShow >= products.length) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "inline-block";
      }
    }
  }

  renderHomeGrid();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      itemsToShow += 6;
      renderHomeGrid();
    });
  }
}
