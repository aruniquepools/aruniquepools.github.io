// ===== MOBILE NAV TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('active');
      }
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll('.main-nav > li').forEach(function(item) {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown');
    if (dropdown && link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    }
  });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    document.querySelectorAll('.gallery-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
      });
    }
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // ===== TABS =====
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const tabGroup = this.closest('.tabs-wrapper') || document;
      tabGroup.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      tabGroup.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      this.classList.add('active');
      var target = document.getElementById(this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== FADE IN ON SCROLL =====
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .service-card, .team-card, .cert-card, .blog-card, .stat-card').forEach(function(el) {
    observer.observe(el);
  });
});

// ===== MODAL FUNCTIONS =====
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}
function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// ===== SELLER DASHBOARD FUNCTIONS =====

// Sidebar toggle for mobile
function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

// Local Storage helpers
function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {
    return [];
  }
}
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== WALLET =====
function linkWallet() {
  var input = document.getElementById('walletAddress');
  if (!input) return;
  var address = input.value.trim();
  if (address.length !== 56 || address.charAt(0) !== 'G') {
    showNotification('Please enter a valid Pi wallet address (56 characters starting with G).', 'error');
    return;
  }
  localStorage.setItem('piWallet', address);
  showNotification('Pi wallet linked successfully!', 'success');
  updateWalletUI();
}

function updateWalletUI() {
  var wallet = localStorage.getItem('piWallet');
  var alertBox = document.querySelector('.wallet-alert');
  var walletStatus = document.getElementById('walletStatus');
  if (wallet) {
    if (alertBox) alertBox.innerHTML = '<div class="alert-box alert-success">&#9989; Wallet linked: ' + wallet.substring(0,8) + '...' + wallet.substring(48) + '</div>';
    if (walletStatus) walletStatus.textContent = 'Linked';
  }
}

// ===== PRODUCTS =====
function addProduct() {
  var name = document.getElementById('productName');
  var price = document.getElementById('productPrice');
  var desc = document.getElementById('productDesc');
  var cat = document.getElementById('productCategory');
  var imgInput = document.getElementById('productImage');

  if (!name || !price || !name.value.trim() || !price.value) {
    showNotification('Please fill in product name and price.', 'error');
    return;
  }

  var products = getFromStorage('products');
  var newProduct = {
    id: Date.now(),
    name: name.value.trim(),
    price: parseFloat(price.value),
    description: desc ? desc.value.trim() : '',
    category: cat ? cat.value : 'pool',
    image: '',
    createdAt: new Date().toISOString()
  };

  // Handle image
  if (imgInput && imgInput.files && imgInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      newProduct.image = e.target.result;
      products.push(newProduct);
      saveToStorage('products', products);
      showNotification('Product added successfully!', 'success');
      renderProducts();
      clearProductForm();
      updateDashboardStats();
    };
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    newProduct.image = 'images/services-main.jpeg';
    products.push(newProduct);
    saveToStorage('products', products);
    showNotification('Product added successfully!', 'success');
    renderProducts();
    clearProductForm();
    updateDashboardStats();
  }
}

function clearProductForm() {
  var fields = ['productName', 'productPrice', 'productDesc'];
  fields.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var cat = document.getElementById('productCategory');
  if (cat) cat.selectedIndex = 0;
  var img = document.getElementById('productImage');
  if (img) img.value = '';
  var preview = document.getElementById('imagePreview');
  if (preview) preview.innerHTML = '<p>&#128247; Click or drag to upload image</p>';
}

function renderProducts() {
  var container = document.getElementById('productsList');
  if (!container) return;
  var products = getFromStorage('products');
  var countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = products.length;

  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:40px;">No products added yet. Add your first product above.</p>';
    return;
  }

  container.innerHTML = products.map(function(p) {
    return '<div class="product-card">' +
      '<img src="' + (p.image || 'images/services-main.jpeg') + '" alt="' + p.name + '">' +
      '<div class="info">' +
        '<h4>' + p.name + '</h4>' +
        '<p style="color:#666;font-size:.85rem;">' + (p.description || '').substring(0,60) + '</p>' +
        '<p class="price">' + p.price.toFixed(2) + ' π</p>' +
        '<div class="product-actions">' +
          '<button class="btn-edit" onclick="editProduct(' + p.id + ')">Edit</button>' +
          '<button class="btn-delete" onclick="deleteProduct(' + p.id + ')">Delete</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  var products = getFromStorage('products');
  products = products.filter(function(p) { return p.id !== id; });
  saveToStorage('products', products);
  renderProducts();
  updateDashboardStats();
  showNotification('Product deleted.', 'success');
}

function editProduct(id) {
  var products = getFromStorage('products');
  var product = products.find(function(p) { return p.id === id; });
  if (!product) return;
  var name = document.getElementById('productName');
  var price = document.getElementById('productPrice');
  var desc = document.getElementById('productDesc');
  var cat = document.getElementById('productCategory');
  if (name) name.value = product.name;
  if (price) price.value = product.price;
  if (desc) desc.value = product.description || '';
  if (cat) cat.value = product.category || 'pool';
  // Remove old and re-add on save
  deleteProduct(id);
  showNotification('Edit the product details and click Add Product to save.', 'success');
}

// ===== ORDERS =====
function getOrders() {
  return getFromStorage('orders');
}

function createOrder(customerName, customerEmail, customerPhone, items, address) {
  var orders = getOrders();
  var total = items.reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
  var order = {
    id: 'ORD-' + Date.now(),
    customerName: customerName,
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    items: items,
    total: total,
    address: address,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  saveToStorage('orders', orders);
  updateDashboardStats();
  return order;
}

function renderOrders() {
  var tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  var orders = getOrders();
  var countEl = document.getElementById('orderCount');
  if (countEl) countEl.textContent = orders.length;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:30px;">No orders yet.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(function(o) {
    var statusClass = 'status-' + o.status;
    var date = new Date(o.createdAt).toLocaleDateString('en-IN');
    return '<tr>' +
      '<td><strong>' + o.id + '</strong></td>' +
      '<td>' + o.customerName + '</td>' +
      '<td>' + o.items.map(function(i){return i.name;}).join(', ') + '</td>' +
      '<td>' + o.total.toFixed(2) + ' π</td>' +
      '<td><span class="status-badge ' + statusClass + '">' + o.status.charAt(0).toUpperCase() + o.status.slice(1) + '</span></td>' +
      '<td>' + date + '</td>' +
      '<td><select onchange="updateOrderStatus(\'' + o.id + '\', this.value)" style="padding:5px;border-radius:5px;border:1px solid #ddd;">' +
        '<option value="pending"' + (o.status==='pending'?' selected':'') + '>Pending</option>' +
        '<option value="confirmed"' + (o.status==='confirmed'?' selected':'') + '>Confirmed</option>' +
        '<option value="shipped"' + (o.status==='shipped'?' selected':'') + '>Shipped</option>' +
        '<option value="delivered"' + (o.status==='delivered'?' selected':'') + '>Delivered</option>' +
      '</select></td>' +
    '</tr>';
  }).join('');
}

function updateOrderStatus(orderId, status) {
  var orders = getOrders();
  var order = orders.find(function(o) { return o.id === orderId; });
  if (order) {
    order.status = status;
    saveToStorage('orders', orders);
    renderOrders();
    showNotification('Order status updated to ' + status + '.', 'success');
  }
}

// ===== CART (Customer Side) =====
function getCart() {
  return getFromStorage('cart');
}

function addToCart(productId) {
  var products = getFromStorage('products');
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) {
    showNotification('Product not found.', 'error');
    return;
  }
  var cart = getCart();
  var existing = cart.find(function(c) { return c.id === productId; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }
  saveToStorage('cart', cart);
  updateCartCount();
  showNotification(product.name + ' added to cart!', 'success');
}

function updateCartCount() {
  var cart = getCart();
  var badges = document.querySelectorAll('.cart-count');
  var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  badges.forEach(function(b) { b.textContent = total; });
}

function renderCart() {
  var container = document.getElementById('cartItems');
  if (!container) return;
  var cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:40px;">Your cart is empty. Browse our <a href="order.html" style="color:#1976d2;">products</a> to add items.</p>';
    updateOrderSummary();
    return;
  }
  container.innerHTML = cart.map(function(item) {
    return '<div class="order-item">' +
      '<img src="' + (item.image || 'images/services-main.jpeg') + '" alt="' + item.name + '">' +
      '<div class="details">' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + item.price.toFixed(2) + ' π each</p>' +
        '<div class="qty-controls">' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">−</button>' +
          '<span style="font-weight:600;min-width:24px;text-align:center;">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
          '<button onclick="removeFromCart(' + item.id + ')" style="margin-left:15px;background:none;color:#c62828;font-size:.85rem;cursor:pointer;border:none;">Remove</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  updateOrderSummary();
}

function changeQty(id, delta) {
  var cart = getCart();
  var item = cart.find(function(c) { return c.id === id; });
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(function(c) { return c.id !== id; });
    }
    saveToStorage('cart', cart);
    renderCart();
    updateCartCount();
  }
}

function removeFromCart(id) {
  var cart = getCart().filter(function(c) { return c.id !== id; });
  saveToStorage('cart', cart);
  renderCart();
  updateCartCount();
}

function updateOrderSummary() {
  var cart = getCart();
  var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
  var shipping = cart.length > 0 ? 50 : 0;
  var total = subtotal + shipping;
  var subtotalEl = document.getElementById('subtotal');
  var shippingEl = document.getElementById('shipping');
  var totalEl = document.getElementById('totalAmount');
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' π';
  if (shippingEl) shippingEl.textContent = shipping > 0 ? shipping.toFixed(2) + ' π' : 'Free';
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' π';
}

function placeOrder() {
  var cart = getCart();
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }
  var name = document.getElementById('custName');
  var email = document.getElementById('custEmail');
  var phone = document.getElementById('custPhone');
  var address = document.getElementById('custAddress');
  if (!name || !email || !phone || !address || !name.value.trim() || !email.value.trim() || !phone.value.trim() || !address.value.trim()) {
    showNotification('Please fill in all details.', 'error');
    return;
  }
  var order = createOrder(name.value.trim(), email.value.trim(), phone.value.trim(), cart, address.value.trim());
  saveToStorage('cart', []);
  showNotification('Order placed successfully! Order ID: ' + order.id, 'success');
  renderCart();
  updateCartCount();
  // Clear form
  name.value = ''; email.value = ''; phone.value = ''; address.value = '';
}

// ===== DASHBOARD STATS =====
function updateDashboardStats() {
  var products = getFromStorage('products');
  var orders = getOrders();
  var earnings = orders.reduce(function(sum, o) { return sum + o.total; }, 0);
  var pCount = document.getElementById('productCount');
  var oCount = document.getElementById('orderCount');
  var eCount = document.getElementById('earningsCount');
  if (pCount) pCount.textContent = products.length;
  if (oCount) oCount.textContent = orders.length;
  if (eCount) eCount.textContent = earnings.toFixed(2);
}

// ===== DELIVERY SETTINGS =====
function saveDeliverySettings() {
  var method = document.getElementById('deliveryMethod');
  var charge = document.getElementById('deliveryCharge');
  var time = document.getElementById('deliveryTime');
  var settings = {
    method: method ? method.value : 'standard',
    charge: charge ? charge.value : '50',
    time: time ? time.value : '7'
  };
  localStorage.setItem('deliverySettings', JSON.stringify(settings));
  showNotification('Delivery settings saved!', 'success');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type) {
  var existing = document.querySelector('.notification');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.className = 'notification';
  div.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:10px;color:#fff;font-weight:500;z-index:99999;animation:fadeInUp .3s ease;max-width:350px;box-shadow:0 4px 20px rgba(0,0,0,.2);';
  div.style.background = type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#1565c0';
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(function() { div.remove(); }, 4000);
}

// ===== IMAGE PREVIEW =====
function previewImage(input) {
  var preview = document.getElementById('imagePreview');
  if (!preview || !input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    preview.innerHTML = '<img src="' + e.target.result + '" style="max-height:150px;border-radius:8px;">';
  };
  reader.readAsDataURL(input.files[0]);
}

// ===== CONTACT FORM =====
function submitContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  showNotification('Thank you for your inquiry! We will get back to you soon.', 'success');
  form.reset();
  return false;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWalletUI();
  if (document.getElementById('productsList')) renderProducts();
  if (document.getElementById('ordersBody')) renderOrders();
  if (document.getElementById('cartItems')) renderCart();
  updateDashboardStats();
});
