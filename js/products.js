// products.js — product listing page logic
"use strict";

function initProducts() {
  console.log("Products page loaded ✅");

  const grid = document.getElementById("products-grid");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const loadMoreBtn = document.getElementById("load-more-products");

  let itemsToShow = 12;
  let products = getProducts();

  // Render initial batch
  if (grid) {
    renderGrid(grid, products.slice(0, itemsToShow));
  }

  // Load More functionality
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      itemsToShow += 12;
      renderGrid(grid, products.slice(0, itemsToShow));
      if (itemsToShow >= products.length) {
        loadMoreBtn.style.display = "none";
      }
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = products.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
      renderGrid(grid, filtered.slice(0, itemsToShow));
    });
  }

  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const cat = categoryFilter.value;
      const filtered = cat === "all" ? products : products.filter(p => p.category === cat);
      renderGrid(grid, filtered.slice(0, itemsToShow));
    });
  }
}
