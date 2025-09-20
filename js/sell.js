// sell.js — handles product submission form
"use strict";

function initSell() {
  console.log("Sell page loaded ✅");

  const form = document.getElementById("sell-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = form.querySelector("[name=title]").value.trim();
    const price = parseFloat(form.querySelector("[name=price]").value);
    const category = form.querySelector("[name=category]").value;
    const description = form.querySelector("[name=description]").value.trim();
    const image = form.querySelector("[name=image]").value.trim();

    if (!title || isNaN(price) || price <= 0) {
      alert("Please enter a valid title and price.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title,
      price,
      category,
      description,
      image: image || "assets/placeholder.jpg",
      pinned: false
    };

    // Save to local storage
    saveProduct(newProduct);

    alert("✅ Product posted successfully!");
    form.reset();

    // Optionally redirect to products page
    window.location.href = "products.html";
  });
}
