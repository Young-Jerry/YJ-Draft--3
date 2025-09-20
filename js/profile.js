// profile.js — user profile page logic
"use strict";

function initProfile() {
  console.log("Profile page loaded ✅");

  const profileName = document.getElementById("profile-name");
  const postedGrid = document.getElementById("posted-products");

  // Get current user (placeholder: demo1 for now)
  const currentUser = localStorage.getItem("nb_current_user") || "demo1";
  if (profileName) profileName.textContent = currentUser;

  // Load all products from storage
  const allProducts = getProducts();

  // Filter only products by this user
  const userProducts = allProducts.filter(p => p.owner === currentUser);

  if (postedGrid) {
    if (userProducts.length > 0) {
      renderGrid(postedGrid, userProducts);
    } else {
      postedGrid.innerHTML = `<p class="muted">You haven’t posted anything yet.</p>`;
    }
  }
}
