/* login.js – handles login form */

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-msg");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = this.username.value.trim();
    const password = this.password.value.trim();

    if (username && password) {
      localStorage.setItem("nb_logged_in_user", username);
      loginMsg.textContent = "✅ Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    } else {
      loginMsg.textContent = "❌ Please enter username and password.";
    }
  });
});
