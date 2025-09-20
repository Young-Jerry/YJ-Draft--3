<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nepali Bazar — Sell</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>Post a Listing</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="sell.html">Sell</a>
      <a href="profile.html">Profile</a>
    </nav>
  </header>

  <form id="sell-form">
    <input id="sell-title" name="title" placeholder="Title" required>
    <textarea id="sell-desc" name="description" placeholder="Description"></textarea>
    <input id="sell-price" name="price" type="number" placeholder="Price">
    <select id="sell-category" name="category">
      <option value="">Select Category</option>
      <option value="electronics">Electronics</option>
      <option value="fashion">Fashion</option>
    </select>
    <select id="sell-province" name="province">
      <option value="">Province</option>
      <option value="3">Bagmati</option>
      <option value="1">Province 1</option>
    </select>
    <select id="sell-city" name="city"><option value="">-- Select City --</option></select>
    <input id="sell-images" type="file" accept="image/*" multiple>
    <div id="preview-images"></div>
    <input id="expiryDate" name="expiryDate" type="date">
    <input name="contact" placeholder="Contact Info">

    <button type="button" id="save-draft">Save Draft</button>
    <button type="submit">Publish</button>
  </form>

  <script src="js/app.js"></script>
</body>
</html>
