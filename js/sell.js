"use strict";

/* sell.js — improved: login restriction, live preview, delete images, save via addProduct() */

function initSell() {
  console.log("Sell page init ✅");

  // require core helpers
  if (typeof getCurrentUser !== "function" || typeof addProduct !== "function" || typeof getProducts !== "function") {
    console.error("core.js functions missing. Make sure core.js is loaded before sell.js");
    return;
  }

  // enforce login: redirect guests to login page
  const currentUser = getCurrentUser();
  if (!currentUser) {
    // user must log in
    window.location.href = "login.html";
    return;
  }

  // elements
  const form = document.getElementById("sell-form");
  const imageInput = document.getElementById("sell-images");
  const previewContainer = document.getElementById("image-preview-container");
  const previewThumbs = document.getElementById("preview-thumbs");
  const previewMainImg = document.getElementById("preview-main-img");
  const publishBtn = document.getElementById("publish-btn");
  const successModal = document.getElementById("sell-success");
  const successClose = document.getElementById("sell-success-close");
  const successCloseBtn = document.getElementById("sell-modal-close");

  // province -> cities mapping (simple)
  const citiesByProvince = {
    "Province 1": ["Biratnagar", "Ilam", "Jhapa"],
    "Madhesh Province": ["Janakpur", "Bardibas"],
    "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur"],
    "Gandaki Province": ["Pokhara"],
    "Lumbini Province": ["Bhairahawa", "Butwal"],
    "Karnali Province": ["Birendranagar"],
    "Sudurpashchim Province": ["Dhangadhi"]
  };

  // wire province -> city population
  const provinceEl = document.getElementById("sell-province");
  const cityEl = document.getElementById("sell-city");
  function populateCities() {
    cityEl.innerHTML = '<option value="">-- Select City --</option>';
    const prov = provinceEl.value;
    if (!prov || !citiesByProvince[prov]) {
      cityEl.disabled = true;
      return;
    }
    cityEl.disabled = false;
    citiesByProvince[prov].forEach(c => {
      const opt = document.createElement("option");
      opt.value = c; opt.textContent = c;
      cityEl.appendChild(opt);
    });
  }
  if (provinceEl) {
    populateCities();
    provinceEl.addEventListener("change", () => { populateCities(); updateLivePreview(); });
  }

  // state
  let selectedFiles = []; // keeps File objects

  // helper: append new files (avoid duplicates) and cap at 3
  function appendFiles(newFiles) {
    const arr = Array.from(newFiles || []);
    // simply append then slice
    selectedFiles = selectedFiles.concat(arr).slice(0, 3);
  }

  // update preview (text + thumbs + main image + owner)
  function updateLivePreview() {
    const title = (document.getElementById("sell-title").value || "").trim();
    const desc = (document.getElementById("sell-desc").value || "").trim();
    const price = document.getElementById("sell-price").value || "0";
    const category = document.getElementById("sell-category").value || "-";
    const province = document.getElementById("sell-province").value || "-";
    const city = document.getElementById("sell-city").value || "-";
    const contact = (document.getElementById("sell-contact") && document.getElementById("sell-contact").value) || "";

    document.getElementById("preview-title").textContent = title || "Your Title";
    document.getElementById("preview-desc").textContent = desc || "Your description will appear here.";
    document.getElementById("preview-price").textContent = `रु ${Number(price).toLocaleString('en-IN')}`;
    document.getElementById("preview-address").textContent = `Location: ${city !== "-" ? city + ', ' : ''}${province !== "-" ? province : ''}`;
    document.getElementById("preview-by").textContent = `By: ${currentUser.username || currentUser.id || "You"}`;
    const previewContact = document.getElementById("preview-contact");
    if (previewContact) {
      if (contact) {
        previewContact.href = contact.includes("@") ? `mailto:${contact}` : `tel:${contact}`;
        previewContact.textContent = contact;
      } else {
        previewContact.href = "#";
        previewContact.textContent = "Contact Seller";
      }
    }

    // thumbnails & main image - if we have selectedFiles we show their dataURLs, else placeholder
    previewThumbs.innerHTML = "";
    previewMainImg.src = "assets/images/placeholder.jpg";

    if (selectedFiles.length === 0) return;

    // read files synchronously to show first image quickly
    selectedFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        // main image: first loaded becomes main if none set yet
        if (idx === 0) previewMainImg.src = ev.target.result;
        const thumb = document.createElement("img");
        thumb.src = ev.target.result;
        thumb.alt = `Image ${idx + 1}`;
        thumb.loading = "lazy";
        thumb.addEventListener("click", () => {
          previewMainImg.src = ev.target.result;
        });
        previewThumbs.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  }

  // render file thumbnails in form with delete btns
  function renderFormPreviews() {
    previewContainer.innerHTML = "";
    selectedFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-preview";
        wrapper.innerHTML = `
          <img src="${ev.target.result}" alt="preview">
          <button type="button" data-index="${idx}" aria-label="Remove image">×</button>
        `;
        previewContainer.appendChild(wrapper);
      };
      reader.readAsDataURL(file);
    });
  }

  // when file input changes: append and re-render
  if (imageInput) {
    imageInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      appendFiles(files);
      renderFormPreviews();
      updateLivePreview();
      // clear native input so re-selecting same file is possible later
      imageInput.value = "";
    });
  }

  // delete image handler (delegation)
  if (previewContainer) {
    previewContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;
      const idx = Number(btn.getAttribute("data-index"));
      if (!Number.isInteger(idx)) return;
      selectedFiles.splice(idx, 1);
      renderFormPreviews();
      updateLivePreview();
    });
  }

  // wire live preview to input/select changes
  const liveFields = ["sell-title", "sell-desc", "sell-price", "sell-category", "sell-province", "sell-city", "sell-contact"];
  liveFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", updateLivePreview);
    el.addEventListener("change", updateLivePreview);
  });

  // SUBMIT: validate, convert images to base64, save using addProduct()
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const title = (document.getElementById("sell-title").value || "").trim();
    const description = (document.getElementById("sell-desc").value || "").trim();
    const priceVal = document.getElementById("sell-price").value;
    const price = Number(priceVal);
    const category = document.getElementById("sell-category").value || "Other";
    const province = document.getElementById("sell-province").value || "";
    const city = document.getElementById("sell-city").value || "";
    const contact = (document.getElementById("sell-contact").value || "").trim();

    // basic validation
    if (!title || !description || !category || !province || !city || isNaN(price) || price <= 0) {
      alert("Please fill all required fields and enter a valid price.");
      return;
    }

    // disable button
    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing...";

    // read selectedFiles to dataURLs
    const readers = selectedFiles.map(f => new Promise((res) => {
      const r = new FileReader();
      r.onload = (ev) => res(ev.target.result);
      r.onerror = () => res(null);
      r.readAsDataURL(f);
    }));

    Promise.all(readers).then(images => {
      const filteredImages = images.filter(Boolean).slice(0, 3);
      const product = {
        id: String(Date.now() + Math.floor(Math.random() * 1000)),
        title,
        description,
        price,
        category,
        location: `${city}, ${province}`,
        images: filteredImages,
        image: filteredImages[0] || "assets/images/placeholder.jpg",
        sellerName: currentUser.username || currentUser.id,
        contact,
        ownerId: currentUser.id || currentUser.username,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
      };

      try {
        addProduct(product); // core.js function
      } catch (e) {
        console.error("Failed to save product", e);
        alert("Could not save listing. See console for details.");
      }

      // show success modal
      if (successModal) {
        successModal.setAttribute("aria-hidden", "false");
        successModal.classList.add("open");
      }

      // reset form & preview
      form.reset();
      selectedFiles = [];
      renderFormPreviews();
      updateLivePreview();
    }).finally(() => {
      publishBtn.disabled = false;
      publishBtn.textContent = "Publish Listing";
    });
  });

  // modal close
  if (successClose) successClose.addEventListener("click", () => {
    successModal.setAttribute("aria-hidden", "true");
    successModal.classList.remove("open");
  });
  if (successCloseBtn) successCloseBtn.addEventListener("click", () => {
    successModal.setAttribute("aria-hidden", "true");
    successModal.classList.remove("open");
  });

  // init preview
  updateLivePreview();
  renderFormPreviews();
}
