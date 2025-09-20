// sell.js — updated: name/ID alignment, image preview, save via addProduct()
"use strict";

function initSell() {
  console.log("Sell page loaded ✅");

  // safe element getters
  const form = document.getElementById("sell-form");
  if (!form) return;

  const titleEl = form.querySelector("[name=title]");
  const descEl = form.querySelector("[name=description]");
  const priceEl = form.querySelector("[name=price]");
  const categoryEl = form.querySelector("[name=category]");
  const provinceEl = form.querySelector("[name=province]");
  const cityEl = form.querySelector("[name=city]");
  const contactEl = form.querySelector("[name=contact]");
  const imagesInput = form.querySelector("[name=imageFiles]");
  const publishBtn = document.getElementById("publish-btn");

  // preview elements
  const previewTitle = document.getElementById("preview-title");
  const previewDesc = document.getElementById("preview-desc");
  const previewPrice = document.getElementById("preview-price");
  const previewLocation = document.getElementById("preview-location");
  const previewBy = document.getElementById("preview-by");
  const previewMainImg = document.getElementById("preview-main-img");
  const previewThumbs = document.getElementById("preview-thumbs");
  const previewContact = document.getElementById("preview-contact");

  // modal elements
  const successModal = document.getElementById("sell-success");
  const successClose = document.getElementById("sell-success-close");
  const sellModalCloseBtn = document.getElementById("sell-modal-close");

  // simple province->cities map (you can expand)
  const citiesByProvince = {
    "Province 1": ["Biratnagar", "Dharan"],
    "Madhesh Province": ["Janakpur", "Bardibas"],
    "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur"],
    "Gandaki Province": ["Pokhara"],
    "Lumbini Province": ["Bhairahawa", "Butwal"],
    "Karnali Province": ["Birendranagar"],
    "Sudurpashchim Province": ["Dhangadhi"]
  };

  // populate city select based on province
  function populateCities() {
    const prov = provinceEl.value;
    cityEl.innerHTML = '<option value="">-- Select City --</option>';
    if (!prov || !citiesByProvince[prov]) { cityEl.disabled = true; return; }
    cityEl.disabled = false;
    citiesByProvince[prov].forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      cityEl.appendChild(opt);
    });
  }
  if (provinceEl) {
    populateCities();
    provinceEl.addEventListener("change", populateCities);
  }

  // keep a small in-memory images array for previews (data URLs)
  let imagesData = [];

  // preview update function
  function updatePreview() {
    previewTitle.textContent = titleEl.value.trim() || "Your Title";
    previewDesc.textContent = descEl.value.trim() || "Your description will appear here.";
    previewPrice.textContent = `रु ${Number(priceEl.value || 0).toLocaleString('en-IN')}`;
    const city = cityEl.value || "";
    const prov = provinceEl.value || "";
    previewLocation.textContent = `Location: ${city ? city + ', ' : ''}${prov || ''}`.replace(/^Location: $/, 'Location: -');
    const current = getCurrentUser();
    previewBy.textContent = `By: ${current && current.username ? current.username : "You"}`;
    previewContact.href = contactEl.value ? (contactEl.value.includes('@') ? `mailto:${contactEl.value}` : `tel:${contactEl.value}`) : "#";
    previewContact.textContent = contactEl.value ? (contactEl.value) : "Contact seller";

    // main image
    if (imagesData.length > 0) {
      previewMainImg.src = imagesData[0];
    } else {
      previewMainImg.src = "assets/images/placeholder.jpg";
    }

    // thumbs
    previewThumbs.innerHTML = "";
    imagesData.forEach((d, idx) => {
      const img = document.createElement("img");
      img.src = d;
      img.alt = `Preview ${idx+1}`;
      img.loading = "lazy";
      img.addEventListener("click", () => { previewMainImg.src = d; });
      previewThumbs.appendChild(img);
    });
  }

  // listen for input changes to update preview
  [titleEl, descEl, priceEl, provinceEl, cityEl, contactEl].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updatePreview);
    el.addEventListener("change", updatePreview);
  });

  // handle image files input
  if (imagesInput) {
    imagesInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      // enforce max 3
      if (files.length > 3) {
        alert("Please upload up to 3 images only.");
        imagesInput.value = "";
        return;
      }

      // read each file as data URL (small images ok for demo)
      imagesData = [];
      let readCount = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          imagesData.push(ev.target.result);
          readCount++;
          if (readCount === files.length) {
            updatePreview();
          }
        };
        reader.onerror = () => {
          console.warn("Image read error", file);
          readCount++;
        };
        reader.readAsDataURL(file);
      });

      if (files.length === 0) {
        imagesData = [];
        updatePreview();
      }
    });
  }

  // modal close handlers
  function closeSuccessModal() {
    if (!successModal) return;
    successModal.setAttribute("aria-hidden", "true");
    successModal.classList.remove("open");
  }
  if (successClose) successClose.addEventListener("click", closeSuccessModal);
  if (sellModalCloseBtn) sellModalCloseBtn.addEventListener("click", closeSuccessModal);

  // form submit
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    // simple validation
    const title = titleEl.value.trim();
    const price = Number(priceEl.value);
    const description = descEl.value.trim();
    const category = categoryEl.value;
    const province = provinceEl.value;
    const city = cityEl.value;
    const contact = contactEl.value.trim();

    if (!title || !description || !category || !province || !city || isNaN(price) || price <= 0) {
      alert("Please fill all required fields and enter a valid price.");
      return;
    }

    // owner (use current user if present)
    const currentUser = getCurrentUser();
    const ownerId = currentUser && currentUser.id ? currentUser.id : "guest";

    // construct product object matching core/products expectations
    const newProduct = {
      id: String(Date.now() + Math.floor(Math.random() * 1000)),
      title,
      description,
      price: Number(price),
      category,
      location: `${city}, ${province}`,
      images: imagesData.slice(0, 3), // data URLs for demo; recommended to host externally in prod
      image: imagesData[0] || "assets/images/placeholder.jpg",
      sellerName: currentUser && currentUser.username ? currentUser.username : "Anonymous",
      contact: contact || "",
      ownerId: String(ownerId),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    };

    // disable button to prevent double submits
    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing...";

    try {
      // use addProduct from core.js (ensure core.js contains addProduct)
      if (typeof addProduct === "function") {
        addProduct(newProduct);
      } else {
        // fallback: getProducts & saveProducts
        const products = getProducts();
        products.unshift(newProduct);
        saveProducts(products);
      }

      // show success modal
      if (successModal) {
        successModal.setAttribute("aria-hidden", "false");
        successModal.classList.add("open");
      } else {
        alert("Listing Published!");
      }

      // re-enable and reset form after tiny delay
      setTimeout(() => {
        publishBtn.disabled = false;
        publishBtn.textContent = "Publish Listing";
        form.reset();
        imagesData = [];
        updatePreview();
      }, 600);

    } catch (err) {
      console.error("Failed to save product", err);
      alert("Could not save listing — see console for details.");
      publishBtn.disabled = false;
      publishBtn.textContent = "Publish Listing";
    }
  });

  // initial preview populate
  updatePreview();

  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
