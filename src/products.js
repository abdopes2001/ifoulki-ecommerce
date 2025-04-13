// src/products.js

// Fetch all products from the backend API
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

// Render products in the grid
function displayProducts(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = ''; // Clear existing content

  if (!products.length) {
    grid.innerHTML = '<p class="text-center col-span-full">No products found.</p>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'border p-4 rounded shadow hover:shadow-lg transition flex flex-col';
    card.innerHTML = `
      <a href="product.html?id=${p._id}">
        <img src="${p.image || '/public/logo.png'}" alt="${p.name}" class="w-full h-48 object-cover rounded mb-2" />
      </a>
      <div class="flex-grow">
        <h2 class="text-lg font-semibold">
          <a href="product.html?id=${p._id}">${p.name}</a>
        </h2>
        <p class="text-sm text-gray-600">${p.category || ''}</p>
        <p class="font-bold mt-1">${p.price} ${p.currency}</p>
      </div>
      <button class="mt-3 bg-amber-600 text-white px-3 py-1 rounded">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Search input filter
document.getElementById('searchInput').addEventListener('input', async (e) => {
  const keyword = e.target.value.toLowerCase();
  const products = await fetchProducts();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    (p.category && p.category.toLowerCase().includes(keyword))
  );
  displayProducts(filtered);
});

// Initial load
fetchProducts().then(displayProducts);