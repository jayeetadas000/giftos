// Set current year
// function getYear() {
//   const currentYear = new Date().getFullYear();
//   const yearEl = document.querySelector("#displayYear");
//   if (yearEl) yearEl.textContent = currentYear;
// }
// getYear();

// Owl Carousel Setup
$('.owl-carousel').owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  autoplay: true,
  autoplayHoverPause: true,
  responsive: {
    0: { items: 1 },
    600: { items: 3 },
    1000: { items: 6 }
  }
});

// Load Header & Footer
fetch('includes/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    setActiveNav();
    renderCartDrawer();
    updateCartCount();

    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      cartIcon.addEventListener("click", function (e) {
        e.preventDefault();
        openCartDrawer();
      });
    }

    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        document.getElementById('cartDrawer').classList.remove('open');
      });
    }

    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
      openCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (!isLoggedIn) {
          localStorage.setItem('redirectAfterLogin', 'check-out.html');
          alert('Please login or register before proceeding to checkout.');
          window.location.href = 'login.html';
        } else {
          window.location.href = './check-out.html';
        }
      });
    }

    const logoutLink = document.getElementById('logout-btn');
    if (logoutLink) {
      logoutLink.addEventListener('click', logout);
    }
  });

fetch('includes/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });

// Product Click
const productBoxes = document.querySelectorAll('.product-box');
productBoxes.forEach(product => {
  product.addEventListener('click', () => {
    const id = product.getAttribute('data-id');
    const name = product.getAttribute('data-name');
    const price = product.getAttribute('data-price');
    const image = product.getAttribute('data-image');
    const productData = { id, name, price, image };
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    window.location.href = 'product-details.html';
  });
});

// Render Product Details
const product = JSON.parse(localStorage.getItem('selectedProduct'));
if (product) {
  const nameEl = document.getElementById('product-name');
  const priceEl = document.getElementById('product-price');
  const imageEl = document.getElementById('product-image');
  if (nameEl && priceEl && imageEl) {
    nameEl.innerText = product.name;
    priceEl.innerText = `$${product.price}`;
    imageEl.src = product.image;
    imageEl.alt = product.name;
  }
} else {
  const detailsDiv = document.querySelector('.product-details');
  if (detailsDiv) {
    detailsDiv.innerHTML = "<h2>Product not found.</h2>";
  }
}

// Add to Cart
const addToCartBtn = document.getElementById('add-to-cart');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartDrawer();
    openCartDrawer();
  });
}

// Utility Functions
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.add('open');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}

function renderCartDrawer() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsDiv = document.getElementById('cartItems');
  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = '';
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    updateCartCount();
    return;
  }

  cart.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span>${item.name} - $${item.price}</span>
      <button class="remove" onclick="removeFromCart(${i})">×</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  updateCartCount();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartDrawer();
}

function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      const href = link.getAttribute('href');
      if (
        href === currentPath ||
        (currentPath === '' && href.includes('index')) ||
        (currentPath.includes('product-details') && href.includes('shop'))
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
}

// Checkout Page Logic
if (window.location.pathname.includes('check-out.html')) {
  document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert("You must be logged in to view the checkout page.");
      window.location.href = 'login.html';
      return;
    }

    const form = document.getElementById("orderForm");
    const thankYouMessage = document.getElementById("thankYouMessage");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const address = document.getElementById("address").value.trim();
        const codChecked = document.getElementById("cod").checked;

        if (!address) {
          alert("Please enter your address.");
          return;
        }

        if (!codChecked) {
          alert("Please check the Cash on Delivery option.");
          return;
        }

        form.style.display = "none";
        thankYouMessage.style.display = "block";

        localStorage.removeItem('cart');
        updateCartCount();
      });
    }
  });
}

// Login Page Logic
if (window.location.pathname.includes('login.html')) {
  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(user => user.email === email && user.password === password);

        if (matchedUser) {
          localStorage.setItem('userLoggedIn', 'true');
          alert("Login successful!");

          const redirectTo = localStorage.getItem('redirectAfterLogin') || 'index.html';
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectTo;
        } else {
          alert("Invalid email or password.");
        }
      });
    }
  });
}

// Register Page Logic
if (window.location.pathname.includes('register.html')) {
  document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
          alert("Email already registered.");
          return;
        }

        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('userLoggedIn', 'true');

        alert("Registration successful!");
        const redirectTo = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectTo;
      });
    }
  });
}

// Logout function
function logout() {
  localStorage.removeItem('userLoggedIn');
  alert('You have been logged out.');
  window.location.href = 'index.html';
}
