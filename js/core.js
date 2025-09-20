// core.js — shared utilities
"use strict";

// Keys
const STORAGE_KEY = window.LOCAL_STORAGE_KEY || "nb_products_v1";
const USERS_KEY = window.LOCAL_USERS_KEY || "nb_users_v1";
const PINNED_KEY = "nb_pinned";
const CURRENT_USER_KEY = "nb_current_user";

// Storage Helpers
function loadFromStorage(key, fallback = []) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch (e) {
    console.warn("loadFromStorage parse error", e);
    return fallback;
  }
}
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("saveToStorage error", e);
  }
}

// Product Helpers
function getProducts() {
  return loadFromStorage(STORAGE_KEY, []);
}
function saveProducts(products) {
  saveToStorage(STORAGE_KEY, products);
}
function addProduct(product) {
  const products = getProducts();
  product.id = Date.now();
  products.push(product);
  saveProducts(products);
  return product;
}

// User / Auth Helpers
function getUsers() {
  return loadFromStorage(USERS_KEY, []);
}
function saveUsers(users) {
  saveToStorage(USERS_KEY, users);
}
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch (e) {
    return null;
  }
}
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
function logoutUser(event) {
  if (event && event.preventDefault) event.preventDefault();
  setCurrentUser(null);
  // redirect to login or refresh
  window.location.href = "login.html";
}

// Pin / Wishlist Helpers
function getPinned() {
  return loadFromStorage(PINNED_KEY, []);
}
function savePinned(pins) {
  saveToStorage(PINNED_KEY, pins);
}

// Render Helpers
function renderGrid(container, products) {
  if (!container) return;
  container.innerHTML = "";
  if (!products || products.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No products found.";
    p.className = "muted";
    container.appendChild(p);
    return;
  }
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.image || 'assets/images/placeholder.jpg'}" alt="${p.title || ''}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'"></div>
      <div class="title">${p.title || 'Untitled'}</div>
      <div class="price">रु ${p.price}</div>
    `;
    container.appendChild(card);
  });
}

// Core init
function initCore() {
  console.log("Core initialized");

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  // Username / dropdown UI
  const current = getCurrentUser();
  const loginLink = document.getElementById("login-link");
  const userDropdown = document.getElementById("user-dropdown");
  const usernameDisplay = document.getElementById("username-display");

  if (current && current.username) {
    if (loginLink) loginLink.style.display = "none";
    if (userDropdown) {
      userDropdown.style.display = "flex";
      usernameDisplay.textContent = current.username;
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (userDropdown) userDropdown.style.display = "none";
  }
}
