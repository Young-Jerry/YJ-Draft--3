// app.js — tiny router to call page inits
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initCore(); // always run shared setup first

  const page = document.body.dataset.page; // add data-page="index" etc. in <body>

  switch (page) {
    case "index":
      initIndex();
      break;
    case "products":
      initProducts();
      break;
    case "sell":
      initSell();
      break;
    case "profile":
      initProfile();
      break;
    default:
      console.log("No init for this page.");
  }
});
