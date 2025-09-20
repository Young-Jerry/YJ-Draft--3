/* core.js — shared utilities for Nepali Bazar (improved + seeding + safe loaders) */
"use strict";

// ------------------ CONFIG ------------------
const STORAGE_KEY = window.LOCAL_STORAGE_KEY || "nb_products_v1";
const USERS_KEY = window.LOCAL_USERS_KEY || "nb_users_v1";
const PINNED_KEY = "nb_pinned";
const CURRENT_USER_KEY = "nb_current_user";

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
function addProduct(product) {
  const products = getProducts();
  product.id = String(Date.now() + Math.floor(Math.random() * 1000));
  product.createdAt = Date.now();
  products.unshift(product);
  saveProducts(products);
  return product;
}

// ------------------ USERS ------------------
function getUsers() { return loadFromStorage(USERS_KEY, []); }
function saveUsers(users) { saveToStorage(USERS_KEY, users); }
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
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

// ------------------ SEED DATA (first-run) ------------------
function seedIfEmpty() {
  const products = getProducts();
  if (products.length === 0) {
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
        sellerName: "Ramesh",
        contact: "9800000000",
        ownerId: "1",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
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
        sellerName: "Sita",
        contact: "9810000000",
        ownerId: "2",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
      },
      {
        id: String(Date.now() + 3),
        title: "Fresh Organic Vegetables (Weekly Box)",
        description: "Local produce box — seasonal vegetables, delivered weekly.",
        price: 600,
        location: "Bhaktapur",
        category: "Other",
        image: "assets/images/veggies.jpg",
        images: ["assets/images/veggies.jpg"],
        sellerName: "Ram",
        contact: "9801111111",
        ownerId: "1",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
      },
      {
        id: String(Date.now() + 4),
        title: "Gaming Monitor 27\" 144Hz",
        description: "Excellent condition, near-mint. HDMI + DisplayPort.",
        price: 35000,
        location: "Kathmandu",
        category: "Electronics",
        image: "assets/images/monitor.jpg",
        images: ["assets/images/monitor.jpg"],
        sellerName: "Sushil",
        contact: "9802222222",
        ownerId: "2",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
      }
    ];
    saveProducts(sample);
    console.info("Seeded sample products:", sample.length);
  }

  const users = getUsers();
  if (!users || users.length === 0) {
    const demoUsers = [
      { id: "1", username: "demo", role: "user" },
      { id: "2", username: "admin", role: "admin" }
    ];
    saveUsers(demoUsers);
    console.info("Seeded demo users");
  }
}

// ------------------ HELPERS ------------------
function findProductById(id) {
  return getProducts().find(p => String(p.id) === String(id));
}

function safeGetEl(id) { return document.getElementById(id) || null; }

// ------------------ UI / INIT (core) ------------------
function initCore() {
  console.info("Core initialized ✅");
  // seed if needed
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

  // basic dropdown toggle
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
