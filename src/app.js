// app.js — Frontend Logic for Ifoulki E-commerce

// Load language files dynamically
let currentLang = 'en';

async function loadLanguage(lang) {
  try {
    const response = await fetch(`/src/lang/${lang}.json`);
    const data = await response.json();

    // Apply text values to the page (example only)
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (data[key]) {
        el.textContent = data[key];
      }
    });

    currentLang = lang;
  } catch (error) {
    console.error("Failed to load language file:", error);
  }
}

// Language switcher (to be linked with UI buttons)
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);

  document.querySelectorAll(".lang-switch").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      loadLanguage(lang);
    });
  });
});

// Future features: Cart logic placeholder
const cart = {
  items: [],
  add(product) {
    this.items.push(product);
    console.log(`Added to cart:`, product);
  },
  clear() {
    this.items = [];
  }
};