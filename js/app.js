// core.js — shared utilities for Nepali Bazar
"use strict";

// ------------------ CONFIG ------------------
const STORAGE_KEY = window.LOCAL_STORAGE_KEY || "nb_products_v1";
const USERS_KEY = window.LOCAL_USERS_KEY || "nb_users_v1";
const MAX_EXPIRY_DAYS = 7;
const MAX_PRICE = 100000000;

// ------------------ STORAGE HELPERS ------------------
function loadFromStorage(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ------------------ PRODUCT HELPERS ------------------
function getProducts() {
  return loadFromStorage(STORAGE_KEY);
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

// ------------------ USER / AUTH HELPERS ------------------
function getUsers() {
  return loadFromStorage(USERS_KEY);
}
function saveUsers(users) {
  saveToStorage(USERS_KEY, users);
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("nb_current_user"));
}
function setCurrentUser(user) {
  localStorage.setItem("nb_current_user", JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem("nb_current_user");
  window.location.href = "login.html";
}

// ------------------ PIN & WISHLIST HELPERS ------------------
function getPinned() {
  return loadFromStorage("nb_pinned");
}
function savePinned(pins) {
  saveToStorage("nb_pinned", pins);
}
function getWishlist() {
  return loadFromStorage("nb_wishlist");
}
function saveWishlist(list) {
  saveToStorage("nb_wishlist", list);
}

// ------------------ RENDER HELPERS ------------------
function renderGrid(container, products) {
  container.innerHTML = "";
  if (!products.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image || "assets/images/placeholder.jpg"}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">रु ${p.price}</p>
    `;
    container.appendChild(card);
  });
}

// ------------------ CORE INITIALIZER ------------------
function initCore() {
  console.log("Core initialized ✅");

  // Simple logout button wiring
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
}
