// ==================== Shopping Cart Functionality ====================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('lumo_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('lumo_cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    saveCart(cart);
    showNotification('Product added to cart!');
    return false; // Prevent default action
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            renderCart();
        }
    }
}

// Calculate cart totals
function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 100) : 0;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return {
        subtotal,
        shipping,
        tax,
        total,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
}

// Render cart items
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsList.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        emptyCart.style.display = 'none';
        cartItemsList.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = false;

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart('${item.id}')" title="Remove item">
                            ×
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p class="item-total-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
            </div>
        `).join('');
    }

    updateSummary();
}

// Update order summary
function updateSummary() {
    const totals = calculateTotals();

    document.getElementById('total-items').textContent = totals.itemCount;
    document.getElementById('subtotal').textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    document.getElementById('shipping').textContent = totals.shipping === 0 && totals.subtotal > 0 ? 'FREE' : `₹${totals.shipping.toLocaleString('en-IN')}`;
    document.getElementById('tax').textContent = `₹${Math.round(totals.tax).toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹${Math.round(totals.total).toLocaleString('en-IN')}`;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Create mini cart dropdown
function createMiniCart() {
    const cart = getCart();
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart-dropdown';
    
    if (cart.length === 0) {
        miniCart.innerHTML = `
            <div class="mini-cart-empty">
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        const items = cart.slice(0, 3).map(item => `
            <div class="mini-cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="mini-cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
        `).join('');
        
        const totals = calculateTotals();
        const moreItems = cart.length > 3 ? `<p class="mini-cart-more">+${cart.length - 3} more items</p>` : '';
        
        miniCart.innerHTML = `
            <div class="mini-cart-items">
                ${items}
                ${moreItems}
            </div>
            <div class="mini-cart-footer">
                <div class="mini-cart-total">
                    <span>Subtotal:</span>
                    <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <button class="mini-cart-btn" onclick="window.location.href='cart.html'">View Cart</button>
            </div>
        `;
    }
    
    return miniCart;
}

// Show mini cart on hover
function initMiniCart() {
    const cartButtons = document.querySelectorAll('.btn-cart');
    cartButtons.forEach(btn => {
        let miniCart = null;
        let timeout = null;
        
        btn.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            
            // Remove existing mini cart
            const existing = document.querySelector('.mini-cart-dropdown');
            if (existing) existing.remove();
            
            // Create and position mini cart
            miniCart = createMiniCart();
            const rect = btn.getBoundingClientRect();
            miniCart.style.cssText = `
                position: fixed;
                top: ${rect.bottom + 10}px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 9999;
                min-width: 320px;
                max-width: 400px;
                animation: fadeIn 0.2s ease;
            `;
            
            document.body.appendChild(miniCart);
            
            // Keep mini cart open when hovering over it
            miniCart.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
            });
            
            miniCart.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    miniCart.remove();
                }, 300);
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                if (miniCart && miniCart.parentNode) {
                    miniCart.remove();
                }
            }, 300);
        });
    });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Mini Cart Styles */
    .mini-cart-dropdown {
        padding: 20px;
    }

    .mini-cart-empty {
        text-align: center;
        padding: 20px;
        color: #666;
    }

    .mini-cart-items {
        max-height: 300px;
        overflow-y: auto;
    }

    .mini-cart-item {
        display: flex;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .mini-cart-item:last-child {
        border-bottom: none;
    }

    .mini-cart-item img {
        width: 60px;
        height: 70px;
        object-fit: cover;
        border-radius: 8px;
    }

    .mini-cart-item-info {
        flex: 1;
    }

    .mini-cart-item-info h4 {
        font-size: 0.95rem;
        margin: 0 0 5px 0;
        color: #1a1a1a;
    }

    .mini-cart-item-info p {
        font-size: 0.85rem;
        color: #667eea;
        font-weight: 600;
        margin: 0;
    }

    .mini-cart-more {
        text-align: center;
        color: #888;
        font-size: 0.9rem;
        padding: 10px 0;
        margin: 0;
    }

    .mini-cart-footer {
        border-top: 1px solid #f0f0f0;
        padding-top: 15px;
        margin-top: 10px;
    }

    .mini-cart-total {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        margin-bottom: 15px;
        color: #1a1a1a;
    }

    .mini-cart-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .mini-cart-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
`;
document.head.appendChild(style);

// Handle checkout
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart on cart page
    if (document.querySelector('.cart-section')) {
        renderCart();
    }

    // Update cart count on all pages
    updateCartCount();

    // Initialize mini cart hover
    initMiniCart();

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn !== 'true') {
                localStorage.setItem('redirectAfterLogin', 'cart.html');
                window.location.href = 'auth.html';
            } else {
                // Proceed to checkout
                alert('Checkout functionality coming soon!');
            }
        });
    }

    // Cart icon click - redirect to cart page
    const cartButtons = document.querySelectorAll('.btn-cart');
    cartButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'cart.html';
        });
    });

    // Add to cart buttons on product pages
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.querySelector('.product-name')?.textContent.trim().replace(/\s+/g, '-').toLowerCase() || Math.random().toString(),
                    name: productCard.querySelector('.product-name')?.textContent.trim() || 'Product',
                    price: parseInt(productCard.querySelector('.current-price')?.textContent.replace(/[₹,]/g, '') || '0'),
                    image: productCard.querySelector('img')?.src || '',
                    category: productCard.querySelector('.product-category')?.textContent.trim() || 'General'
                };

                addToCart(product);
            }
        });
    });
});

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
