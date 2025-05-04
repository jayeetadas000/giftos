// Get current year
function getYear() {
  const currentYear = new Date().getFullYear();
  const yearEl = document.querySelector("#displayYear");
  if (yearEl) yearEl.textContent = currentYear;
}
getYear();

// Owl carousel setup
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

function changeImage(element) {
  const mainImage = document.getElementById('main-image');
  if (mainImage) mainImage.src = element.src;
}

// Load Header and Footer
fetch('includes/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    setActiveNav(); //Set active menu item based on URL

    // Cart icon click
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      cartIcon.addEventListener("click", function (e) {
        e.preventDefault();
        openCartDrawer();
      });
    }

    // Cart open/close buttons
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

    // Checkout button logic
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (!isLoggedIn) {
          alert('You need to login to proceed to checkout.');
        } else {
          window.location.href = 'checkout.html';
        }
      });
    }

    
    renderCartDrawer();
    updateCartCount();
  });

fetch('includes/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });

// Product click -> save to localStorage and redirect
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

// Render product details from localStorage
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

// Add to cart
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

// New: Set nav item active based on current page
function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop(); // e.g., 'shop.html'

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
