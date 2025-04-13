// src/product.js

async function fetchProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  return await res.json();
}

function renderProduct(product) {
  const container = document.getElementById('productContainer');
  container.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <img src="${product.image}" class="w-full md:w-1/2 rounded shadow" />
      <div>
        <h1 class="text-2xl font-bold">${product.name}</h1>
        <p class="text-sm text-gray-600 mt-1">${product.category}</p>
        <p class="text-lg font-bold mt-4">${product.price} ${product.currency}</p>
        <p class="mt-4">${product.description}</p>
        <button class="mt-6 bg-amber-600 text-white px-4 py-2 rounded">Add to Cart</button>
      </div>
    </div>
  `;
}

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const productId = getProductIdFromURL();
if (productId) {
  fetchProduct(productId).then(renderProduct);
} else {
  document.getElementById("productContainer").innerHTML = "<p>Product not found.</p>";
}