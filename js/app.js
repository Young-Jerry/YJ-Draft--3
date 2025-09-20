/* ========================================================================== 
   app.js — tiny router for Nepali Bazar
   Calls init functions based on <body data-page="">
   ========================================================================== */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initCore(); // always run shared setup first

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
      console.log("No init for this page.");
  }
});
