// ==================== Checkout Page Functionality ====================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('lumo_cart');
    return cart ? JSON.parse(cart) : [];
}

// Calculate totals
function calculateCheckoutTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}

// Display order items
function displayOrderItems() {
    const cart = getCart();
    const itemsContainer = document.getElementById('checkoutItems');
    
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">Your cart is empty</p>';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-category">${item.category}</div>
                <div class="checkout-item-details">
                    <span class="checkout-item-quantity">Qty: ${item.quantity}</span>
                    <span class="checkout-item-price">₹${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Display totals
function displayTotals() {
    const { subtotal, shipping, tax, total } = calculateCheckoutTotals();

    document.getElementById('checkoutSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    document.getElementById('checkoutTax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('checkoutTotal').textContent = `₹${total.toLocaleString()}`;
}

// Send confirmation email using Web3Forms
async function sendConfirmationEmail(email, orderDetails) {
    try {
        // Create email content
        const itemsList = orderDetails.items.map(item => 
            `${item.name} (${item.category}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
        ).join('\n');

        const emailBody = `
Order Confirmation - ${orderDetails.orderId}

Thank you for your order!

ORDER DETAILS:
${itemsList}

SUMMARY:
Subtotal: ₹${orderDetails.subtotal.toLocaleString()}
Shipping: ${orderDetails.shipping === 0 ? 'FREE' : '₹' + orderDetails.shipping}
Tax (18%): ₹${orderDetails.tax.toLocaleString()}
Total: ₹${orderDetails.total.toLocaleString()}

Order Date: ${new Date(orderDetails.orderDate).toLocaleString()}
Order ID: ${orderDetails.orderId}

We'll send you a shipping confirmation email when your items are on the way.

Thank you for shopping with Lumo!
        `;

        // Send via Web3Forms (free email service)
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: '8d3bfe1c-3eb9-44f7-981c-b34b7b702e99',
                subject: `Lumo Order Confirmation - ${orderDetails.orderId}`,
                from_name: 'Lumo Premium Clothing',
                to: email,
                message: emailBody,
                replyto: 'orders@lumo.com',
                botcheck: false
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('Email sent successfully to:', email);
            return true;
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't fail the order if email fails
        return false;
    }
}

// Confirm payment
async function confirmPayment() {
    const emailInput = document.getElementById('customerEmail');
    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
        alert('Please enter your email address');
        emailInput.focus();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return;
    }

    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'collections.html';
        return;
    }

    // Disable button to prevent double submission
    const confirmBtn = document.querySelector('.btn-confirm-payment');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    try {
        const { subtotal, shipping, tax, total } = calculateCheckoutTotals();
        
        const orderDetails = {
            email: email,
            items: cart,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total,
            orderDate: new Date().toISOString(),
            orderId: 'LUMO-' + Date.now()
        };

        // Send confirmation email
        await sendConfirmationEmail(email, orderDetails);

        // Save order to localStorage for reference
        const orders = JSON.parse(localStorage.getItem('lumo_orders') || '[]');
        orders.push(orderDetails);
        localStorage.setItem('lumo_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('lumo_cart');

        // Show success modal
        document.getElementById('confirmEmail').textContent = email;
        document.getElementById('successModal').classList.add('active');

        // Track conversion in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: orderDetails.orderId,
                value: total,
                currency: 'INR',
                items: cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    item_category: item.category,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }

    } catch (error) {
        console.error('Error processing payment:', error);
        alert('There was an error processing your payment. Please try again.');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Payment';
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    const cart = getCart();
    
    // Redirect to cart if empty (silently)
    if (cart.length === 0) {
        window.location.href = 'collections.html';
        return;
    }

    displayOrderItems();
    displayTotals();
    
    // Update cart count in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
});

// Make confirmPayment global
window.confirmPayment = confirmPayment;
