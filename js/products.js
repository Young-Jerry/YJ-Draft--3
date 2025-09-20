// products.js — product listing page logic (complete + robust)
"use strict";

/* Utility: debounce */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* Format price safely */
function formatPrice(n) {
  try { return new Intl.NumberFormat('en-IN').format(Number(n)); } catch { return n; }
}

/* Build product card DOM element */
function buildProductCard(p) {
  const card = document.createElement("article");
  card.className = "product-card card";
  card.dataset.id = String(p.id);

  const thumb = document.createElement("div");
  thumb.className = "thumb";
  const img = document.createElement("img");
  img.src = p.image || "assets/images/placeholder.jpg";
  img.alt = p.title || "Product image";
  img.loading = "lazy";
  img.onerror = () => { img.src = "assets/images/placeholder.jpg"; };
  thumb.appendChild(img);

  const title = document.createElement("h3");
  title.textContent = p.title || "Untitled";

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = `रु ${formatPrice(p.price || 0)}`;

  const meta = document.createElement("div");
  meta.className = "meta muted";
  meta.textContent = p.location ? `${p.location}` : "";

  const actions = document.createElement("div");
  actions.className = "actions";
  const viewBtn = document.createElement("button");
  viewBtn.className = "btn view-btn";
  viewBtn.type = "button";
  viewBtn.textContent = "View";
  viewBtn.addEventListener("click", () => openProductModal(p.id));

  actions.appendChild(viewBtn);

  card.appendChild(thumb);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

/* Render a page of products into container */
function renderProductsGrid(container, productsSlice) {
  if (!container) return;
  container.innerHTML = "";
  if (!productsSlice || productsSlice.length === 0) {
    return;
  }
  const frag = document.createDocumentFragment();
  productsSlice.forEach(p => frag.appendChild(buildProductCard(p)));
  container.appendChild(frag);
}

/* Pagination helper: render page controls */
function renderPagination(container, totalItems, pageSize, currentPage, onPage) {
  container.innerHTML = "";
  if (!container) return;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return; // no pagination needed

  // Prev
  const prevBtn = document.createElement("button");
  prevBtn.className = "btn btn-ghost btn-small";
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage <= 1;
  prevBtn.addEventListener("click", () => onPage(currentPage - 1));
  container.appendChild(prevBtn);

  // page numbers (show up to 7)
  const start = Math.max(1, currentPage - 3);
  const end = Math.min(totalPages, start + 6);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost btn-small";
    btn.textContent = String(i);
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => onPage(i));
    container.appendChild(btn);
  }

  // Next
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-ghost btn-small";
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.addEventListener("click", () => onPage(currentPage + 1));
  container.appendChild(nextBtn);
}

/* Modal utilities */
function showModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
}
function hideModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
}

/* Populate and open product modal by id */
function openProductModal(productId) {
  const products = getProducts();
  const p = products.find(x => String(x.id) === String(productId));
  if (!p) return;

  // elements
  const modal = document.getElementById("product-modal");
  const img = document.getElementById("modal-image");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-desc");
  const category = document.getElementById("modal-category");
  const price = document.getElementById("modal-price");
  const locationEl = document.getElementById("modal-location");
  const seller = document.getElementById("modal-seller");
  const contact = document.getElementById("modal-contact");
  const thumbs = document.getElementById("modal-thumbs");
  const editLink = document.getElementById("edit-link");
  const deleteBtn = document.getElementById("delete-btn");

  if (img) { img.src = p.image || "assets/images/placeholder.jpg"; img.alt = p.title || "Product"; img.onerror = () => img.src = "assets/images/placeholder.jpg"; }
  if (title) title.textContent = p.title || "Untitled";
  if (desc) desc.textContent = p.description || "";
  if (category) category.textContent = p.category || "Other";
  if (price) price.textContent = formatPrice(p.price || 0);
  if (locationEl) locationEl.textContent = p.location || "";
  if (seller) seller.textContent = p.sellerName || "Unknown";
  if (contact) {
    const phone = p.contact || p.sellerContact || "";
    contact.textContent = phone || "Not provided";
    contact.href = phone ? `tel:${phone}` : "#";
  }

  // thumbs (if array provided)
  if (thumbs) {
    thumbs.innerHTML = "";
    const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image || "assets/images/placeholder.jpg"];
    images.forEach(src => {
      const t = document.createElement("img");
      t.src = src; t.alt = p.title || "Thumb";
      t.loading = "lazy";
      t.onerror = () => { t.src = "assets/images/placeholder.jpg"; };
      t.tabIndex = 0;
      t.addEventListener("click", () => { if (img) img.src = src; });
      t.addEventListener("keypress", (ev) => { if (ev.key === "Enter") img.src = src; });
      thumbs.appendChild(t);
    });
  }

  // Edit/Delete visibility: only show if current user is owner or admin
  const current = getCurrentUser();
  const isOwner = current && (String(current.id) === String(p.ownerId) || current.role === "admin");
  if (editLink) {
    if (isOwner) { editLink.classList.remove("hidden"); editLink.href = `sell.html?edit=${encodeURIComponent(p.id)}`; }
    else { editLink.classList.add("hidden"); }
  }
  if (deleteBtn) {
    if (isOwner) { deleteBtn.classList.remove("hidden"); } else { deleteBtn.classList.add("hidden"); }
  }

  // show modal
  showModal(modal);

  // wire delete
  if (deleteBtn) {
    deleteBtn.onclick = () => openConfirm(`Delete "${p.title}"?`, () => {
      // delete action
      const remaining = getProducts().filter(x => String(x.id) !== String(p.id));
      saveProducts(remaining);
      renderCurrentView(); // re-render grid
      hideModal(modal);
    });
  }
}

/* Confirmation modal */
function openConfirm(message, onYes) {
  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");
  const yes = document.getElementById("confirm-yes");
  const no = document.getElementById("confirm-no");
  if (!confirmModal || !confirmMessage || !yes || !no) return;
  confirmMessage.textContent = message;
  showModal(confirmModal);

  const cleanup = () => {
    yes.onclick = null;
    no.onclick = null;
    hideModal(confirmModal);
  };
  yes.onclick = () => { onYes && onYes(); cleanup(); };
  no.onclick = cleanup;
}

/* Close modal wiring (global) */
function wireModals() {
  const productModal = document.getElementById("product-modal");
  const modalClose = document.getElementById("modal-close");
  const modalBackdrop = document.getElementById("modal-backdrop");
  if (modalClose && productModal) modalClose.addEventListener("click", () => hideModal(productModal));
  if (modalBackdrop && productModal) modalBackdrop.addEventListener("click", () => hideModal(productModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modals = document.querySelectorAll(".modal:not(.hidden)");
      modals.forEach(m => hideModal(m));
    }
  });
}

/* State for current view (used after delete/edit) */
let _state = {
  allProducts: [],
  filtered: [],
  pageSize: 12,
  currentPage: 1
};

/* Render current filtered view with pagination */
function renderCurrentView() {
  const grid = document.getElementById("products-grid");
  const pagination = document.getElementById("products-pagination");
  const empty = document.getElementById("empty-state");

  const total = _state.filtered.length;
  const start = (_state.currentPage - 1) * _state.pageSize;
  const slice = _state.filtered.slice(start, start + _state.pageSize);

  if (grid) renderProductsGrid(grid, slice);

  // empty state toggle
  if (empty) {
    if (_state.filtered.length === 0) empty.classList.remove("hidden");
    else empty.classList.add("hidden");
  }

  // pagination
  if (pagination) {
    pagination.innerHTML = "";
    renderPagination(pagination, total, _state.pageSize, _state.currentPage, (page) => {
      _state.currentPage = page;
      renderCurrentView();
      window.scrollTo({ top: 200, behavior: 'smooth' });
    });
  }
}

/* Apply filters & sort to full product list and update state */
function applyFiltersAndSort({ query = "", category = "all", sort = "newest" } = {}) {
  let products = getProducts() || [];
  // search
  const q = String(query || "").trim().toLowerCase();
  if (q) {
    products = products.filter(p => {
      const title = (p.title || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }
  // category
  if (category && category !== "all") {
    products = products.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
  }
  // sort
  products.sort((a, b) => {
    if (sort === "newest") {
      return (b.createdAt || 0) - (a.createdAt || 0);
    } else if (sort === "oldest") {
      return (a.createdAt || 0) - (b.createdAt || 0);
    } else if (sort === "price-asc") {
      return (Number(a.price) || 0) - (Number(b.price) || 0);
    } else if (sort === "price-desc") {
      return (Number(b.price) || 0) - (Number(a.price) || 0);
    }
    return 0;
  });

  _state.allProducts = getProducts();
  _state.filtered = products;
  _state.currentPage = 1;
  renderCurrentView();
}

/* Main init for products page */
function initProducts() {
  console.log("Products page loaded ✅");

  // Ensure core seeding has run (core.initCore should call seedIfEmpty)
  if (typeof seedIfEmpty === "function") seedIfEmpty();

  // Wire modal close
  wireModals();

  // Get controls
  const searchBox = document.getElementById("search-box");
  const categoryFilter = document.getElementById("filter-category");
  const sortFilter = document.getElementById("filter-sort");

  // initial apply
  applyFiltersAndSort({});

  // Debounced search
  if (searchBox) {
    searchBox.addEventListener("input", debounce((e) => {
      applyFiltersAndSort({ query: e.target.value, category: categoryFilter ? categoryFilter.value : 'all', sort: sortFilter ? sortFilter.value : 'newest' });
    }, 220));
  }

  // Category change
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      applyFiltersAndSort({ query: searchBox ? searchBox.value : "", category: categoryFilter.value, sort: sortFilter ? sortFilter.value : 'newest' });
    });
  }

  // Sort change
  if (sortFilter) {
    sortFilter.addEventListener("change", () => {
      applyFiltersAndSort({ query: searchBox ? searchBox.value : "", category: categoryFilter ? categoryFilter.value : 'all', sort: sortFilter.value });
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
