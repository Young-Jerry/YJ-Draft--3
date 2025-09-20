"use strict";

function initSell() {
  console.log("Sell page loaded ✅");

  // Redirect if not logged in
  const currentUser = localStorage.getItem("nb_current_user");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById("sell-form");
  const imageInput = document.getElementById("sell-images");
  const previewContainer = document.getElementById("image-preview-container");
  const previewImages = document.getElementById("preview-images");

  let selectedFiles = [];

  // Province → City mapping
  const provinceCities = {
    "1": ["Biratnagar", "Dharan", "Itahari", "Mechinagar", "Damak", "Birtamod", "Inaruwa", "Ilam", "Dhankuta", "Pathari-Sanishchare", "Sundarharaicha", "Urlabari"],
    "2": ["Birgunj", "Janakpur", "Kalaiya", "Jitpur Simara", "Rajbiraj", "Siraha", "Lalbandi", "Malangawa", "Nijgadh", "Gaushala"],
    "3": ["Kathmandu", "Lalitpur", "Bharatpur", "Hetauda", "Banepa", "Bhaktapur", "Madhyapur Thimi", "Kirtipur", "Dhulikhel"],
    "4": ["Pokhara", "Baglung", "Besisahar", "Gorkha", "Putalibazar", "Waling"],
    "5": ["Butwal", "Nepalgunj", "Tansen", "Bardaghat", "Devdaha", "Kapilvastu", "Lamahi"],
    "6": ["Birendranagar", "Chhedagad", "Musikot", "Dullu", "Sharada", "Thuli Bheri"],
    "7": ["Dhangadhi", "Bhimdatta", "Amargadhi", "Tikapur", "Belauri", "Bedkot"]
  };

  const provinceSelect = document.getElementById("sell-province");
  const citySelect = document.getElementById("sell-city");

  provinceSelect.addEventListener("change", () => {
    const province = provinceSelect.value;
    citySelect.innerHTML = "";
    if (province && provinceCities[province]) {
      provinceCities[province].forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    }
    updateLivePreview();
  });

  citySelect.addEventListener("change", updateLivePreview);

  // Handle image preview
  imageInput.addEventListener("change", () => {
    selectedFiles = Array.from(imageInput.files).slice(0, 3);
    renderPreviews();
    updateLivePreview();
  });

  function renderPreviews() {
    previewContainer.innerHTML = "";
    previewImages.innerHTML = "";
    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = e => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-preview";
        wrapper.innerHTML = `
          <img src="${e.target.result}" alt="preview">
          <button type="button" data-index="${index}">×</button>
        `;
        previewContainer.appendChild(wrapper);

        const img = document.createElement("img");
        img.src = e.target.result;
        previewImages.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  // Delete image
  previewContainer.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(e.target.dataset.index, 10);
      selectedFiles.splice(index, 1);
      renderPreviews();
      updateLivePreview();
    }
  });

  // Live preview updates for text inputs
  ["sell-title", "sell-desc", "sell-price", "sell-category"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateLivePreview);
  });

  function updateLivePreview() {
    document.getElementById("preview-title").textContent =
      document.getElementById("sell-title").value || "Your Title";
    document.getElementById("preview-desc").textContent =
      document.getElementById("sell-desc").value || "Your description will appear here.";
    document.getElementById("preview-price").textContent =
      "NPR " + (document.getElementById("sell-price").value || "0");

    const province = provinceSelect.options[provinceSelect.selectedIndex]?.text || "-";
    const city = citySelect.value || "-";
    document.getElementById("preview-address").textContent = `Address: ${province}, ${city}`;
  }

  // Submit form
  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("sell-title").value.trim();
    const desc = document.getElementById("sell-desc").value.trim();
    const price = parseFloat(document.getElementById("sell-price").value);
    const category = document.getElementById("sell-category").value;
    const province = provinceSelect.options[provinceSelect.selectedIndex]?.text;
    const city = citySelect.value;

    if (!title || !desc || isNaN(price) || price <= 0) {
      alert("⚠ Please fill all fields correctly!");
      return;
    }

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

      document.getElementById("sell-success").style.display = "flex";
      form.reset();
      selectedFiles = [];
      previewContainer.innerHTML = "";
      previewImages.innerHTML = "";
      updateLivePreview();
    });
  });

  document.querySelectorAll("#sell-success .close").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("sell-success").style.display = "none";
    });
  });
}
