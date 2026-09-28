
const products = [
  {
    id: 1,
    name: "Classic Sneakers",
    category: "Shoes",
    price: 1999,
    stock: 12,
    img: "images/sneaker.jpg"
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Shoes",
    price: 2999,
    stock: 8,
    img: "images/running.jpg"
  },
  {
    id: 3,
    name: "Formal Shoes",
    category: "Shoes",
    price: 3499,
    stock: 5,
    img: "images/formal.jpg"
  },
  {
    id: 4,
    name: "Blue Jeans",
    category: "Pants",
    price: 1499,
    stock: 15,
    img: "images/blue jeans.jpg"
  },
  {
    id: 5,
    name: "Chinos",
    category: "Pants",
    price: 1999,
    stock: 7,
    img: "images/chinos.jpg"
  },
  {
    id: 6,
    name: "Formal Trousers",
    category: "Pants",
    price: 2199,
    stock: 10,
    img: "images/formal trouser.jpg"
  },
  {
    id: 7,
    name: "Oxford Shirt",
    category: "Shirts",
    price: 1299,
    stock: 6,
    img: "images/oxford.jpg"
  },
  {
    id: 8,
    name: "Linen Shirt",
    category: "Shirts",
    price: 1499,
    stock: 3,
    img: "images/linen.jpg"
  },
  {
    id: 9,
    name: "Checked Shirt",
    category: "Shirts",
    price: 1399,
    stock: 9,
    img: "images/checked.jpg"
  },
  {
    id: 10,
    name: "Crew Neck T-Shirt",
    category: "T-Shirts",
    price: 499,
    stock: 20,
    img: "images/crew nwck.jpg"
  },
  {
    id: 11,
    name: "V-Neck T-Shirt",
    category: "T-Shirts",
    price: 599,
    stock: 4,
    img: "images/v neck.jpg"
  },
  {
    id: 12,
    name: "Graphic Tee",
    category: "T-Shirts",
    price: 799,
    stock: 2,
    img: "images/graphic.jpg"
  }
];


const categoriesList = ["All", "Shoes", "Pants", "Shirts", "T-Shirts"];
let currentCategory = "All";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");
const cartSidebar = document.getElementById("cart-sidebar");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const authModal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authButtons = document.getElementById("auth-buttons");
const userMenu = document.getElementById("user-menu");
const toastContainer = document.getElementById("toast-container");

function showToast(message, type = "info", duration = 4000) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: "✓",
    error: "✕",
    info: "ℹ"
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 100);
  
  const closeToast = () => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };
  
  toast.querySelector(".toast-close").onclick = closeToast;
  
  setTimeout(closeToast, duration);
}

function renderCategories() {
  categoriesEl.innerHTML = "";
  categoriesList.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn" + (cat === currentCategory ? " active" : "");
    btn.textContent = cat;
    btn.onclick = () => {
      currentCategory = cat;
      renderCategories();
      updateRenderProducts();
    };
    categoriesEl.appendChild(btn);
  });
}


function renderProducts() {
  updateRenderProducts();
}

function addToCart(id) {
  const prod = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
    showToast(`Added another ${prod.name} to cart`, "success", 2000);
  } else {
    cart.push({ ...prod, qty: 1 });
    showToast(`${prod.name} added to cart`, "success", 2000);
  }
  saveCart();
  renderCart();
  renderProducts();
  cartSidebar.classList.add("open");
}

function changeProductQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  
  saveCart();
  renderCart();
  renderProducts();
  
  if (cart.length === 0) {
    cartSidebar.classList.remove("open");
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
  updateRenderProducts();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
  }

  let total = 0, count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${item.img}">
      <div>
        <div class="name">${item.name}</div>
        <div class="muted">₹${item.price} × ${item.qty}</div>
      </div>
      <div class="controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });

  cartTotalEl.textContent = total;
  cartCountEl.textContent = count;
}


document.getElementById("cart-icon").onclick = () => {
  cartSidebar.classList.toggle("open");
};
document.getElementById("close-cart").onclick = () => {
  cartSidebar.classList.remove("open");
};

document.getElementById("checkout-btn").onclick = () => {
  if (!cart.length) return showToast("Cart is empty", "error");
  if (!currentUser) {
    showToast("Please login to checkout", "info");
    showAuthModal('login');
    return;
  }
  showCheckoutPage();
};

function showAuthModal(type) {
  authModal.style.display = "block";
  if (type === 'login') {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  }
}

function hideAuthModal() {
  authModal.style.display = "none";
  clearAuthForms();
}

function clearAuthForms() {
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("register-name").value = "";
  document.getElementById("register-email").value = "";
  document.getElementById("register-password").value = "";
  document.getElementById("register-confirm").value = "";
}

function updateAuthUI() {
  if (currentUser) {
    authButtons.style.display = "none";
    userMenu.style.display = "flex";
    document.getElementById("user-name").textContent = `Hi, ${currentUser.name}`;
  } else {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
  }
}

function register() {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;

  if (!name || !email || !password || !confirm) {
    showToast("Please fill all fields", "error");
    return;
  }

  if (password !== confirm) {
    showToast("Passwords don't match", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters long", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  
  if (users.find(u => u.email === email)) {
    showToast("Email already registered. Please login", "error");
    return;
  }

  const user = { id: Date.now(), name, email, password };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  
  showToast("Registration successful! Please login", "success");
  showAuthModal('login');
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please enter email and password", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showToast("Invalid email or password", "error");
    return;
  }

  currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
  hideAuthModal();
  updateAuthUI();
  showToast(`Welcome back, ${currentUser.name}!`, "success");
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthUI();
  showToast("Logged out successfully!", "success");
}

function setupPasswordToggles() {
  const toggles = ['login-password-toggle', 'register-password-toggle', 'register-confirm-toggle'];
  
  toggles.forEach(toggleId => {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      toggle.onclick = () => {
        const passwordField = toggle.previousElementSibling;
        if (passwordField.type === 'password') {
          passwordField.type = 'text';
          toggle.textContent = '🙈';
        } else {
          passwordField.type = 'password';
          toggle.textContent = '👁️';
        }
      };
    }
  });
}

function showCheckoutPage() {
  currentPage = "checkout";
  document.getElementById("homepage").style.display = "none";
  document.getElementById("products-page").style.display = "none";
  document.getElementById("checkout-page").style.display = "block";
  document.getElementById("success-page").style.display = "none";
  cartSidebar.classList.remove("open");
  
  showBackNavigation();
  updateHeaderNavigation();
  renderCheckoutItems();
  setupPaymentOptions();
}

function renderCheckoutItems() {
  const checkoutItemsEl = document.getElementById("checkout-items");
  const checkoutTotalEl = document.getElementById("checkout-total");
  
  checkoutItemsEl.innerHTML = "";
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.qty;
    
    const itemEl = document.createElement("div");
    itemEl.className = "checkout-item";
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-price">₹${item.price} × ${item.qty}</div>
      </div>
      <div class="item-total">₹${item.price * item.qty}</div>
    `;
    
    checkoutItemsEl.appendChild(itemEl);
  });
  
  checkoutTotalEl.textContent = total;
}

function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
  const cardForm = document.getElementById("card-form");
  
  paymentOptions.forEach(option => {
    option.onchange = () => {
      if (option.value === 'card') {
        cardForm.style.display = 'block';
      } else {
        cardForm.style.display = 'none';
      }
    };
  });
  
  setupCardInputs();
}

function setupCardInputs() {
  const cardNumber = document.getElementById("card-number");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvv = document.getElementById("card-cvv");
  
  cardNumber.oninput = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
    e.target.value = formattedValue;
  };
  
  cardExpiry.oninput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  };
  
  cardCvv.oninput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };
}

function showSuccessPage(paymentMethod) {
  currentPage = "success";
  document.getElementById("homepage").style.display = "none";
  document.getElementById("products-page").style.display = "none";
  document.getElementById("checkout-page").style.display = "none";
  document.getElementById("success-page").style.display = "block";
  
  showBackNavigation();
  updateHeaderNavigation();
  renderSuccessItems(paymentMethod);
  

  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
    updateRenderProducts(); 
  }, 100);
}

function renderSuccessItems(paymentMethod) {
  const successItemsEl = document.getElementById("success-items");
  const successTotalEl = document.getElementById("success-total");
  const paymentMethodDisplay = document.getElementById("payment-method-display");
  const codAmount = document.getElementById("cod-amount");
  const codTotal = document.getElementById("cod-total");
  
  successItemsEl.innerHTML = "";
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.qty;
    
    const itemEl = document.createElement("div");
    itemEl.className = "success-item";
    itemEl.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    
    successItemsEl.appendChild(itemEl);
  });
  
  successTotalEl.textContent = total;
  
  if (paymentMethod === 'cod') {
    paymentMethodDisplay.textContent = "Cash on Delivery";
    codAmount.style.display = "block";
    codTotal.textContent = total;
  } else {
    paymentMethodDisplay.textContent = "Online Payment (Card)";
    codAmount.style.display = "none";
  }
}

function showBackNavigation() {
  document.getElementById("main-logo").style.display = "none";
  document.getElementById("back-nav").style.display = "flex";
}

function hideBackNavigation() {
  document.getElementById("main-logo").style.display = "flex";
  document.getElementById("back-nav").style.display = "none";
}

function goToHomepage() {
  showHomepage();
}

function continueShopping() {
  showProductsPage();
}

document.getElementById("login-btn").onclick = () => showAuthModal('login');
document.getElementById("close-modal").onclick = hideAuthModal;
document.getElementById("show-register").onclick = (e) => {
  e.preventDefault();
  showAuthModal('register');
};
document.getElementById("show-login").onclick = (e) => {
  e.preventDefault();
  showAuthModal('login');
};
document.getElementById("login-submit").onclick = login;
document.getElementById("register-submit").onclick = register;
document.getElementById("logout-btn").onclick = logout;

document.getElementById("main-logo").onclick = goToHomepage;
document.getElementById("back-btn").onclick = goToHomepage;
document.getElementById("continue-shopping").onclick = continueShopping;
document.getElementById("place-order").onclick = () => {
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  
  if (paymentMethod === 'card') {
    const cardNumber = document.getElementById("card-number").value.trim();
    const cardExpiry = document.getElementById("card-expiry").value.trim();
    const cardCvv = document.getElementById("card-cvv").value.trim();
    const cardName = document.getElementById("card-name").value.trim();
    
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      showToast("Please fill all card details", "error");
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
      showToast("Please enter a valid card number", "error");
      return;
    }
    
    if (cardCvv.length < 3) {
      showToast("Please enter a valid CVV", "error");
      return;
    }
  }
  
  showSuccessPage(paymentMethod);
};

authModal.onclick = (e) => {
  if (e.target === authModal) hideAuthModal();
};

let currentPage = "home";

function updateHeaderNavigation() {
  const productsNavBtn = document.getElementById("products-nav-btn");
  
  if (currentPage === "home") {
    productsNavBtn.style.display = "flex";
  } else {
    productsNavBtn.style.display = "none";
  }
}

function showHomepage() {
  currentPage = "home";
  document.getElementById("homepage").style.display = "block";
  document.getElementById("products-page").style.display = "none";
  document.getElementById("checkout-page").style.display = "none";
  document.getElementById("success-page").style.display = "none";
  hideBackNavigation();
  updateHeaderNavigation();
  cartSidebar.classList.remove("open");
}

function showProductsPage() {
  currentPage = "products";
  document.getElementById("homepage").style.display = "none";
  document.getElementById("products-page").style.display = "block";
  document.getElementById("checkout-page").style.display = "none";
  document.getElementById("success-page").style.display = "none";
  hideBackNavigation();
  updateHeaderNavigation();
}

function getStockWarning(product) {
  const cartItem = cart.find(item => item.id === product.id);
  const cartQty = cartItem ? cartItem.qty : 0;
  const remaining = product.stock - cartQty;
  
  if (remaining <= 3 && remaining > 0) {
    return `<div class="stock-warning">Only ${remaining} left!</div>`;
  }
  return '';
}

function updateRenderProducts() {
  productsEl.innerHTML = "";
  const filtered = currentCategory === "All"
    ? products
    : products.filter(p => p.category === currentCategory);

  filtered.forEach(product => {
    const cartItem = cart.find(item => item.id === product.id);
    const card = document.createElement("div");
    card.className = "product-card";
    
    const stockWarning = getStockWarning(product);
    const cartQty = cartItem ? cartItem.qty : 0;
    const remaining = product.stock - cartQty;
    
    if (cartItem && remaining > 0) {
      card.innerHTML = `
        <img src="${product.img}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <span class="price">₹${product.price}</span>
        </div>
        <div class="product-category">${product.category}${stockWarning}</div>
        <div class="product-quantity">
          <button onclick="changeProductQty(${product.id}, -1)">-</button>
          <span>${cartItem.qty}</span>
          <button onclick="changeProductQty(${product.id}, 1)" ${remaining <= 0 ? 'disabled' : ''}>+</button>
        </div>
      `;
    } else if (remaining > 0) {
      card.innerHTML = `
        <img src="${product.img}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <span class="price">₹${product.price}</span>
        </div>
        <div class="product-category">${product.category}${stockWarning}</div>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
    } else {
      card.innerHTML = `
        <img src="${product.img}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <span class="price">₹${product.price}</span>
        </div>
        <div class="product-category">${product.category}</div>
        <button disabled style="background: #ccc; cursor: not-allowed;">Out of Stock</button>
      `;
    }
    
    productsEl.appendChild(card);
  });
}

function updateAddToCart(id) {
  const prod = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);
  const currentQty = item ? item.qty : 0;
  
  if (currentQty >= prod.stock) {
    showToast("Item is out of stock", "error");
    return;
  }
  
  if (item) {
    item.qty++;
    showToast(`Added another ${prod.name} to cart`, "success", 2000);
  } else {
    cart.push({ ...prod, qty: 1 });
    showToast(`${prod.name} added to cart`, "success", 2000);
  }
  saveCart();
  renderCart();
  updateRenderProducts();
  cartSidebar.classList.add("open");
}

function updateChangeProductQty(id, delta) {
  const prod = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);
  if (!item) return;
  
  const newQty = item.qty + delta;
  
  if (newQty > prod.stock) {
    showToast("Not enough stock available", "error");
    return;
  }
  
  item.qty = newQty;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  
  saveCart();
  renderCart();
  updateRenderProducts();
  
  if (cart.length === 0) {
    cartSidebar.classList.remove("open");
  }
}

document.getElementById("shop-now-btn").onclick = showProductsPage;
document.getElementById("products-nav-btn").onclick = showProductsPage;

document.getElementById("main-logo").onclick = showHomepage;
document.getElementById("back-btn").onclick = showHomepage;


function setupHomepageFeatures() {
  const quickCategories = document.querySelectorAll('.quick-category');
  quickCategories.forEach(category => {
    category.onclick = () => {
      const categoryName = category.dataset.category;
      showProductsPage();
    
      setTimeout(() => {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
          if (btn.textContent.toLowerCase().includes(categoryName)) {
            btn.click();
          }
        });
      }, 100);
    };
  });

  
  const newsletterBtn = document.querySelector('.newsletter-btn');
  const newsletterEmail = document.getElementById('newsletter-email');
  
  if (newsletterBtn && newsletterEmail) {
    newsletterBtn.onclick = () => {
      const email = newsletterEmail.value.trim();
      if (email && isValidEmail(email)) {
        showToast('Thank you for subscribing! You\'ll receive our latest offers.', 'success');
        newsletterEmail.value = '';
      } else {
        showToast('Please enter a valid email address', 'error');
      }
    };

    newsletterEmail.onkeypress = (e) => {
      if (e.key === 'Enter') {
        newsletterBtn.click();
      }
    };
  }


  const primeBtn = document.querySelector('.prime-btn');
  if (primeBtn) {
    primeBtn.onclick = () => {
      showToast('Prime membership coming soon! Stay tuned for exclusive benefits.', 'info');
    };
  }

  populateDealsGrid();
}

function populateDealsGrid() {
  const dealsGrid = document.getElementById('deals-grid');
  if (!dealsGrid) return;

  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const dealProducts = shuffled.slice(0, 4);  dealsGrid.innerHTML = dealProducts.map(product => `
    <div class="deal-card" onclick="addToCart(${product.id})">
      <div class="deal-image">
        <img src="${product.img}" alt="${product.name}" 
             onerror="this.style.display='none'; this.parentElement.innerHTML += '<div class=\\'image-placeholder\\'>📦<br>${product.category}</div>'">
        <div class="deal-badge">Deal</div>
      </div>
      <div class="deal-content">
        <h4>${product.name}</h4>
        <div class="deal-price">
          <span class="current-price">₹${product.price}</span>
          <span class="original-price">₹${Math.floor(product.price * 1.3)}</span>
        </div>
        <div class="deal-discount">${Math.floor(((Math.floor(product.price * 1.3) - product.price) / Math.floor(product.price * 1.3)) * 100)}% off</div>
        ${product.stock <= 3 ? `<div class="stock-warning">Only ${product.stock} left!</div>` : ''}
      </div>
    </div>
  `).join('');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

setupPasswordToggles();
updateAuthUI();
showHomepage();
setupHomepageFeatures();
renderCategories();
updateRenderProducts();
renderCart();

window.addToCart = updateAddToCart;
window.changeQty = changeQty;
window.changeProductQty = updateChangeProductQty;
