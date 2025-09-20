/* ========================================================================== 
   index.js — homepage logic for Nepali Bazar
   Features: pinned ads, trending products, load more, footer year
   ========================================================================== */
"use strict";

function initIndex() {
  console.log("Index page init 🚀");

  const pinnedGrid = document.getElementById("pinned-grid");
  const trendingGrid = document.getElementById("trending-grid");
  const loadMoreBtn = document.getElementById("load-more");
  const yearEl = document.getElementById("year");

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Render pinned ads
  const pinned = getPinned();
  if (pinnedGrid) {
    renderGrid(pinnedGrid, pinned);
  }

  // Render trending products
  const products = getProducts();
  let visibleCount = 6;

  function renderTrending() {
    if (!trendingGrid) return;
    trendingGrid.innerHTML = "";
    renderGrid(trendingGrid, products.slice(0, visibleCount));

    if (loadMoreBtn) {
      if (visibleCount >= products.length) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "inline-block";
      }
    }
  }

  renderTrending();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 6;
      renderTrending();
    });
  }
}
