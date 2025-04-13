let appliedCoupon = null;

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function calculateTotal(cart) {
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      total -= total * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'fixed') {
      total -= appliedCoupon.value;
    }
  }
  return Math.max(total, 0).toFixed(2);
}

function updateTotalDisplay(cart) {
  const totalEl = document.getElementById('checkoutTotal');
  totalEl.textContent = calculateTotal(cart) + (cart[0]?.currency || ' MAD');
}

async function applyCoupon() {
  const code = document.getElementById('couponCode').value;
  const msg = document.getElementById('couponMessage');

  try {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!res.ok) {
      appliedCoupon = null;
      msg.textContent = "Invalid or expired coupon.";
      msg.className = "text-sm text-red-600";
    } else {
      appliedCoupon = await res.json();
      msg.textContent = `Coupon applied: ${appliedCoupon.code}`;
      msg.className = "text-sm text-green-600";
      updateTotalDisplay(getCart());
    }
  } catch {
    msg.textContent = "Error applying coupon.";
    msg.className = "text-sm text-red-600";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  updateTotalDisplay(cart);

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cart.length) return alert("Your cart is empty.");

    const form = e.target;
    const order = {
      customer: {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value
      },
      paymentMethod: form.paymentMethod.value,
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: calculateTotal(cart),
      currency: cart[0]?.currency || 'MAD'
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (res.ok) {
      localStorage.removeItem('cart');
      window.location.href = '/thank-you.html';
    } else {
      alert("Order failed.");
    }
  });
});
