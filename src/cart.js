// src/cart.js

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert("Added to cart!");
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (!container || !totalEl) return;

  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center border p-4 rounded';
    div.innerHTML = `
      <div>
        <h2 class="text-lg font-bold">${item.name}</h2>
        <p>${item.quantity} × ${item.price} ${item.currency}</p>
      </div>
      <button class="text-red-500" onclick="removeFromCart('${item._id}')">Remove</button>
    `;
    total += item.price * item.quantity;
    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item._id !== id);
  saveCart(cart);
  renderCart();
}

if (window.location.pathname.endsWith('cart.html')) {
  renderCart();
}

if (window.location.pathname.endsWith('checkout.html')) {
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = getCart();
    const form = e.target;

    const order = {
      customer: {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value
      },
      paymentMethod: form.paymentMethod.value,
      items: cart.map(p => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity
      })),
      total: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      currency: cart[0]?.currency || "MAD"
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (res.ok) {
      localStorage.removeItem('cart');
      window.location.href = "/thank-you.html";
    } else {
      alert("Error placing order.");
    }
  });
}