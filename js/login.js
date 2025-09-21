/* ========================================================================
   login.js – Handles login form
   ======================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const errorBox = document.querySelector("#errorBox");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = form.username.value.trim().toLowerCase();
    const password = form.password.value.trim();

    const users = NB.getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username && u.password === password
    );

    if (!found) {
      errorBox.textContent = "Invalid username or password.";
      return;
    }

    NB.setCurrentUser(found);
    window.location.href = "index.html";
  });
});
