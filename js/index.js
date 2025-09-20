<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nepali Bazar — Home</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>Nepali Bazar</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="sell.html">Sell</a>
      <a href="profile.html">Profile</a>
    </nav>
  </header>

  <section id="hero">
    <h2>Pinned Ads</h2>
    <div id="pinned-ads" class="grid"></div>
  </section>

  <section>
    <h2>Latest Listings</h2>
    <input type="text" id="home-search" placeholder="Search by title...">
    <div id="home-grid" class="grid"></div>
    <button id="load-more-btn">Load More</button>
  </section>

  <div id="product-modal" class="hidden" aria-hidden="true"></div>

  <script src="js/app.js"></script>
</body>
</html>
