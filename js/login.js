/* login.js – handles login form */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-msg");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = this.username.value.trim();
    const password = this.password.value.trim();

    if (!username || !password) {
      loginMsg.textContent = "❌ Please enter username and password.";
      return;
    }

    // check against stored users
    const users = getUsers(); // from core.js
    const found = users.find((u) => u.username === username);

    if (found) {
      // set current user properly
      setCurrentUser(found); // from core.js
      loginMsg.textContent = "✅ Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      loginMsg.textContent = "❌ User not found.";
    }
  });
});
