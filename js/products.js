
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nepali Bazar — Products</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>Browse Products</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="sell.html">Sell</a>
      <a href="profile.html">Profile</a>
    </nav>
  </header>

  <section class="filters">
    <input type="text" id="search-box" placeholder="Search by title...">
    <select id="filter-category">
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="fashion">Fashion</option>
    </select>
    <input type="number" id="price-min" placeholder="Min Price">
    <input type="number" id="price-max" placeholder="Max Price">
    <select id="filter-sort">
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="price-asc">Price ↑</option>
      <option value="price-desc">Price ↓</option>
    </select>
  </section>

  <div id="products-grid" class="grid"></div>
  <div id="empty-state" class="hidden">No products found.</div>
  <div id="products-pagination"></div>

  <div id="product-modal" class="hidden" aria-hidden="true"></div>

  <script src="js/app.js"></script>
</body>
</html>
