/* core.js — shared utilities for Nepali Bazar (improved + seeding + safe loaders) */
"use strict";

// ------------------ CONFIG ------------------
const STORAGE_KEY = window.LOCAL_STORAGE_KEY || "nb_products_v1";
const USERS_KEY = window.LOCAL_USERS_KEY || "nb_users_v1";
const PINNED_KEY = "nb_pinned";
const CURRENT_USER_KEY = "nb_current_user";
const STORAGE_VERSION = 1;

// ------------------ STORAGE HELPERS ------------------
function loadFromStorage(key, fallback = []) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch (e) {
    console.warn("loadFromStorage parse error for", key, e);
    return fallback;
  }
}
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("saveToStorage error for", key, e);
  }
}

// ------------------ PRODUCTS ------------------
function getProducts() { return loadFromStorage(STORAGE_KEY, []); }
function saveProducts(products) { saveToStorage(STORAGE_KEY, products); }
// Add product and return it
function addProduct(product) {
  const products = getProducts();
  const prod = Object.assign({}, product);
  prod.id = String(prod.id || (Date.now() + Math.floor(Math.random() * 1000)));
  prod.createdAt = prod.createdAt || Date.now();
  // main image compatibility
  if (!prod.image) prod.image = (Array.isArray(prod.images) && prod.images[0]) ? prod.images[0] : prod.image || "assets/images/placeholder.jpg";
  products.unshift(prod);
  saveProducts(products);
  return prod;
}
// alias used by older code
function saveProduct(product) { return addProduct(product); }

// ------------------ USERS ------------------
function getUsers() { return loadFromStorage(USERS_KEY, []); }
function saveUsers(users) { saveToStorage(USERS_KEY, users); }
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function setCurrentUser(user) {
  if (!user) localStorage.removeItem(CURRENT_USER_KEY);
  else localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}
function logoutUser(e) {
  if (e && e.preventDefault) e.preventDefault();
  setCurrentUser(null);
  window.location.href = "login.html";
}

// ------------------ PINNED / WISHLIST ------------------
function getPinned() { return loadFromStorage(PINNED_KEY, []); }
function savePinned(list) { saveToStorage(PINNED_KEY, list); }

// ------------------ CLEANUP (expired listings) ------------------
function pruneExpiredProducts() {
  try {
    const products = getProducts();
    const now = Date.now();
    const filtered = products.filter(p => !p.expiresAt || p.expiresAt > now);
    if (filtered.length !== products.length) saveProducts(filtered);
  } catch (e) {
    console.warn("pruneExpiredProducts failed", e);
  }
}

// ------------------ SEED DATA (first-run) ------------------
function seedIfEmpty() {
  pruneExpiredProducts();

  const products = getProducts();
  if (!products || products.length === 0) {
    const sample = [
      {
        id: String(Date.now() + 1),
        title: "Used Mountain Bike (Good Condition)",
        description: "Well-maintained mountain bike. 21-speed, disc brakes.",
        price: 9500,
        location: "Kathmandu",
        category: "Sports",
        image: "assets/images/bike.jpg",
        images: ["assets/images/bike.jpg"],
        sellerName: "sneha",
        contact: "9800000000",
        ownerId: "sneha",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
      },
      {
        id: String(Date.now() + 2),
        title: "Smartphone — Brand New (128GB)",
        description: "Unboxed phone with full warranty. Charger included.",
        price: 24500,
        location: "Lalitpur",
        category: "Electronics",
        image: "assets/images/phone.jpg",
        images: ["assets/images/phone.jpg"],
        sellerName: "sohaum",
        contact: "9810000000",
        ownerId: "sohaum",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
      }
    ];
    saveProducts(sample);
    console.info("Seeded sample products:", sample.length);
  }

  const users = getUsers();
  if (!users || users.length === 0) {
    const demoUsers = [
      { id: "sohaum", username: "sohaum", role: "admin" },
      { id: "sneha", username: "sneha", role: "user" },
      { id: "demo1", username: "demo1", role: "user" },
      { id: "demo2", username: "demo2", role: "user" }
    ];
    saveUsers(demoUsers);
    console.info("Seeded demo users");
  }
}

// ------------------ HELPERS ------------------
function findProductById(id) { return getProducts().find(p => String(p.id) === String(id)); }
function safeGetEl(id) { return document.getElementById(id) || null; }

// ------------------ UI / INIT (core) ------------------
function initCore() {
  console.info("Core initialized ✅");
  try { seedIfEmpty(); } catch (e) { console.warn("seed failed", e); }

  // wire logout
  const logoutBtn = safeGetEl("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  // header user toggle
  const current = getCurrentUser();
  const loginLink = safeGetEl("login-link");
  const userDropdown = safeGetEl("user-dropdown");
  const usernameDisplay = safeGetEl("username-display");
  if (current && current.username) {
    if (loginLink) loginLink.style.display = "none";
    if (userDropdown) {
      userDropdown.style.display = "flex";
      userDropdown.setAttribute("aria-hidden", "false");
      if (usernameDisplay) usernameDisplay.textContent = current.username;
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (userDropdown) userDropdown.style.display = "none";
  }

  // dropdown toggle
  const userBtn = safeGetEl("user-btn");
  const dropdownMenu = safeGetEl("dropdown-menu");
  if (userBtn && dropdownMenu) {
    userBtn.addEventListener("click", () => {
      const expanded = userBtn.getAttribute("aria-expanded") === "true";
      userBtn.setAttribute("aria-expanded", String(!expanded));
      dropdownMenu.style.display = expanded ? "none" : "flex";
      dropdownMenu.setAttribute("aria-hidden", String(expanded));
    });
  }
}
