// index.js — homepage specific scripts

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Auth handling
  const user = localStorage.getItem("nb_logged_in_user");
  const role = localStorage.getItem("nb_user_role"); // 'admin' | 'user' | null
  const loginLink = document.getElementById("login-link");
  const userDropdown = document.getElementById("user-dropdown");
  const usernameDisplay = document.getElementById("username-display");

  if (user) {
    loginLink.style.display = "none";
    userDropdown.style.display = "inline-block";
    usernameDisplay.textContent = user;

    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("nb_logged_in_user");
        localStorage.removeItem("nb_user_role");
        location.reload();
      }
    });
  }

  // Role-based Pinned Ads visibility
  const pinnedSection = document.getElementById("pinned-ads");
  if (role === "admin") {
    pinnedSection.style.display = "flex"; // visible
  } else {
    pinnedSection.style.display = "none"; // hide for normal + visitors
  }

  // User dropdown toggle
  const userBtn = document.getElementById("user-btn");
  if (userBtn) {
    userBtn.addEventListener("click", (e) => {
      e.preventDefault();
      userDropdown.classList.toggle("active");
    });
    window.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target)) {
        userDropdown.classList.remove("active");
      }
    });
  }

  // Modal handling
  const modal = document.getElementById("nb-modal");
  const modalClose = document.getElementById("modal-close");
  modalClose.addEventListener("click", () => modal.classList.remove("active"));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("active");
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // Load More button
  let itemsToShow = 10;
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      itemsToShow += 10;
      if (typeof renderHomeProducts === "function") {
        renderHomeProducts(itemsToShow);
      }
    });
  }
});
