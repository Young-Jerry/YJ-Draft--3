"use strict";

function initSell() {
  console.log("Sell page loaded ✅");

  const form = document.getElementById("sell-form");
  const imageInput = document.getElementById("sell-images");
  const previewContainer = document.getElementById("image-preview-container");

  let selectedFiles = [];

  // Handle image preview
  imageInput.addEventListener("change", () => {
    selectedFiles = Array.from(imageInput.files).slice(0, 3); // max 3
    renderPreviews();
    updateLivePreview();
  });

  function renderPreviews() {
    previewContainer.innerHTML = "";
    const previewImages = document.getElementById("preview-images");
    previewImages.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = e => {
        // Thumbnail preview in form
        const wrapper = document.createElement("div");
        wrapper.className = "image-preview";
        wrapper.innerHTML = `
          <img src="${e.target.result}" alt="preview">
          <button type="button" data-index="${index}">×</button>
        `;
        previewContainer.appendChild(wrapper);

        // Also show in live preview
        const img = document.createElement("img");
        img.src = e.target.result;
        previewImages.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle delete button
  previewContainer.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(e.target.dataset.index, 10);
      selectedFiles.splice(index, 1);
      renderPreviews();
      updateLivePreview();
    }
  });

  // Live preview updates for text fields
  ["sell-title", "sell-desc", "sell-price", "sell-category", "sell-province", "sell-city"]
    .forEach(id => {
      document.getElementById(id).addEventListener("input", updateLivePreview);
    });

  function updateLivePreview() {
    document.getElementById("preview-title").textContent = document.getElementById("sell-title").value || "Your Title";
    document.getElementById("preview-desc").textContent = document.getElementById("sell-desc").value || "Your description will appear here.";
    document.getElementById("preview-price").textContent = "NPR " + (document.getElementById("sell-price").value || "0");
    const province = document.getElementById("sell-province").value || "-";
    const city = document.getElementById("sell-city").value || "-";
    document.getElementById("preview-address").textContent = `Address: ${province}, ${city}`;
  }

  // Form submit
  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("sell-title").value.trim();
    const desc = document.getElementById("sell-desc").value.trim();
    const price = parseFloat(document.getElementById("sell-price").value);
    const category = document.getElementById("sell-category").value;
    const province = document.getElementById("sell-province").value;
    const city = document.getElementById("sell-city").value;

    if (!title || !desc || isNaN(price) || price <= 0) {
      alert("⚠ Please fill all fields correctly!");
      return;
    }

    const currentUser = localStorage.getItem("nb_current_user") || "demo1";

    // Convert selected files to base64
    const imagePromises = selectedFiles.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(imagePromises).then(images => {
      const newProduct = {
        id: Date.now(),
        title,
        description: desc,
        price,
        category,
        province,
        city,
        images,
        pinned: false,
        owner: currentUser
      };

      saveProduct(newProduct);

      // Show modal
      document.getElementById("sell-success").style.display = "block";
      form.reset();
      selectedFiles = [];
      previewContainer.innerHTML = "";
      document.getElementById("preview-images").innerHTML = "";
      updateLivePreview();
    });
  });

  // Close modal
  document.querySelectorAll("#sell-success .close").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("sell-success").style.display = "none";
    });
  });
}
