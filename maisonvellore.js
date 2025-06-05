const products = [
  {
    id: 1,
    name: "Stylish Jacket",
    price: 59.99,
    description: "A warm and stylish jacket for all seasons.",
    image: "https://via.placeholder.com/200?text=Jacket",
  },
  {
    id: 2,
    name: "Classic Jeans",
    price: 49.99,
    description: "Comfortable classic jeans that fit perfectly.",
    image: "https://via.placeholder.com/200?text=Jeans",
  },
  {
    id: 3,
    name: "Elegant Dress",
    price: 79.99,
    description: "An elegant dress for special occasions.",
    image: "https://via.placeholder.com/200?text=Dress",
  },
  {
    id: 4,
    name: "Casual T-Shirt",
    price: 19.99,
    description: "Simple and comfortable T-Shirt for everyday wear.",
    image: "https://via.placeholder.com/200?text=T-Shirt",
  },
  {
    id: 5,
    name: "Running Sneakers",
    price: 89.99,
    description: "Lightweight sneakers for running and gym.",
    image: "https://via.placeholder.com/200?text=Sneakers",
  },
];

// DOM elements
const productGrid = document.getElementById("product-grid");
const modal = document.getElementById("product-modal");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");

let cart = [];
let currentProduct = null;

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem("fashionCart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("fashionCart", JSON.stringify(cart));
}

// Render products with optional filtering
function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const priceRange = priceFilter.value;

  productGrid.innerHTML = "";

  const filtered = products.filter((product) => {
    // Filter by search term
    if (!product.name.toLowerCase().includes(searchTerm)) return false;

    // Filter by price
    if (priceRange === "under50" && product.price >= 50) return false;
    if (priceRange === "50to70" && (product.price < 50 || product.price > 70))
      return false;
    if (priceRange === "above70" && product.price <= 70) return false;

    return true;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
    `;
    div.addEventListener("click", () => openModal(product));
    productGrid.appendChild(div);
  });
}

// Open product detail modal
function openModal(product) {
  currentProduct = product;
  modalImage.src = product.image;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price.toFixed(2);
  modal.classList.remove("hidden");
}

// Close modal
function closeModal() {
  modal.classList.add("hidden");
  currentProduct = null;
}

// Add product to cart
function addToCart() {
  if (!currentProduct) return;

  const existingIndex = cart.findIndex((item) => item.id === currentProduct.id);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...currentProduct, quantity: 1 });
  }
  updateCartUI();
  closeModal();
}

// Update the cart UI
function updateCartUI() {
  cartItemsList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name}</span>
        <div class="quantity-controls">
          <button data-action="decrease" data-index="${idx}">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-index="${idx}">+</button>
        </div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button data-action="remove" data-index="${idx}">x</button>
      `;
      cartItemsList.appendChild(li);
    });
  }

  total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  saveCart();

  // Add event listeners for cart buttons
  cartItemsList.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-action");
      const index = parseInt(e.target.getAttribute("data-index"));
      if (action === "remove") {
        removeFromCart(index);
      } else if (action === "increase") {
        cart[index].quantity++;
        updateCartUI();
      } else if (action === "decrease") {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          removeFromCart(index);
        }
        updateCartUI();
      }
    });
  });
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Open cart sidebar
function openCart() {
  cartSidebar.classList.remove("hidden");
}

// Close cart sidebar
function closeCart() {
  cartSidebar.classList.add("hidden");
}

// Checkout button click
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert(`Thank you for your purchase! Total: $${cartTotal.textContent}`);
  cart = [];
  updateCartUI();
  closeCart();
}

// Event listeners
modalClose.addEventListener("click", closeModal);
addToCartBtn.addEventListener("click", addToCart);
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", checkout);

searchInput.addEventListener("input", renderProducts);
priceFilter.addEventListener("change", renderProducts);

// Initialize
loadCart();
renderProducts();
updateCartUI();
