/* ========================================================================
   core.js – Global utilities, storage, session, router
   ======================================================================== */
(function () {
  "use strict";

  // ------------------ CONFIG ------------------
  const USERS_KEY = "nb_users_v1";
  const CURRENT_USER_KEY = "nb_current_user";

  // ------------------ SEED USERS ------------------
  const seedUsers = [
    { username: "sohaum", password: "admin123", role: "admin" },
    { username: "sneha", password: "sneha123", role: "user" },
    { username: "demo1", password: "demo1", role: "user" },
    { username: "demo2", password: "demo2", role: "user" },
    { username: "demo3", password: "demo3", role: "user" },
  ];

  function initUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    }
  }

  // ------------------ STORAGE HELPERS ------------------
  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  }

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  }

  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // ------------------ NAVBAR RENDER ------------------
  function renderNavbar() {
    const nav = document.querySelector("nav ul");
    if (!nav) return;

    const user = getCurrentUser();
    nav.innerHTML = "";

    // Guest view
    if (!user) {
      nav.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="products.html">Browse</a></li>
        <li><a href="login.html">Login</a></li>
      `;
      return;
    }

    // Common for logged-in users
    let links = `
      <li><a href="index.html">Home</a></li>
      <li><a href="products.html">Browse</a></li>
      <li><a href="sell.html">Sell</a></li>
      <li><a href="profile.html">Profile</a></li>
    `;

    // Admin-only link
    if (user.role === "admin") {
      links += `<li><a href="admin.html">Admin Panel</a></li>`;
    }

    // Logout button
    links += `<li><a href="#" id="logoutBtn">Logout</a></li>`;

    nav.innerHTML = links;

    // Hook logout
    const logoutBtn = document.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearCurrentUser();
        window.location.href = "login.html";
      });
    }
  }

  // ------------------ INIT ------------------
  window.NB = {
    initUsers,
    getUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    renderNavbar,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initUsers();
    renderNavbar();
  });
})();
