// app.js — small router
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initCore();

  const page = document.body.dataset.page;

  switch (page) {
    case "index":
      if (typeof initIndex === "function") initIndex();
      break;
    case "products":
      if (typeof initProducts === "function") initProducts();
      break;
    case "sell":
      if (typeof initSell === "function") initSell();
      break;
    case "profile":
      if (typeof initProfile === "function") initProfile();
      break;
    default:
      // nothing
      break;
  }
});
