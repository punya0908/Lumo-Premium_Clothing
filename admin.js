// ==================== Admin Panel JavaScript ====================

// Sample products data (in real app, this would come from database)
let products = [
    {
        id: 1,
        name: "Premium Cotton Shirt",
        category: "men",
        price: 2499,
        stock: 45,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
        description: "High-quality cotton shirt",
        badge: "new",
        discount: 0
    },
    {
        id: 2,
        name: "Designer Maxi Dress",
        category: "women",
        price: 3999,
        stock: 30,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        description: "Elegant maxi dress",
        badge: "",
        discount: 0
    },
    {
        id: 3,
        name: "Classic Denim Jacket",
        category: "men",
        price: 4999,
        stock: 25,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        description: "Stylish denim jacket",
        badge: "bestseller",
        discount: 0
    },
    {
        id: 4,
        name: "Professional Blazer",
        category: "women",
        price: 5999,
        stock: 20,
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop",
        description: "Office wear blazer",
        badge: "",
        discount: 0
    },
    {
        id: 5,
        name: "Leather Handbag",
        category: "accessories",
        price: 3799,
        stock: 15,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=500&fit=crop",
        description: "Premium leather bag",
        badge: "sale",
        discount: 15
    },
    {
        id: 6,
        name: "Slim Fit Chinos",
        category: "men",
        price: 2999,
        stock: 50,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
        description: "Comfortable chino pants",
        badge: "new",
        discount: 0
    },
    {
        id: 7,
        name: "Floral Summer Dress",
        category: "women",
        price: 2799,
        stock: 35,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
        description: "Light and breezy summer dress",
        badge: "bestseller",
        discount: 0
    },
    {
        id: 8,
        name: "Casual Sneakers",
        category: "accessories",
        price: 3499,
        stock: 40,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
        description: "Comfortable everyday sneakers",
        badge: "",
        discount: 10
    },
    {
        id: 9,
        name: "Wool Blend Coat",
        category: "men",
        price: 7999,
        stock: 12,
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=500&fit=crop",
        description: "Warm winter coat",
        badge: "new",
        discount: 0
    },
    {
        id: 10,
        name: "Silk Scarf",
        category: "accessories",
        price: 1299,
        stock: 60,
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
        description: "Luxurious silk scarf",
        badge: "",
        discount: 0
    },
    {
        id: 11,
        name: "Athletic Joggers",
        category: "men",
        price: 2199,
        stock: 55,
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop",
        description: "Performance joggers",
        badge: "bestseller",
        discount: 0
    },
    {
        id: 12,
        name: "Leather Ankle Boots",
        category: "women",
        price: 5499,
        stock: 18,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
        description: "Stylish ankle boots",
        badge: "new",
        discount: 0
    },
    {
        id: 13,
        name: "Polo T-Shirt",
        category: "men",
        price: 1799,
        stock: 70,
        image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop",
        description: "Classic polo shirt",
        badge: "",
        discount: 0
    },
    {
        id: 14,
        name: "Bohemian Skirt",
        category: "women",
        price: 2499,
        stock: 28,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
        description: "Flowing bohemian skirt",
        badge: "sale",
        discount: 20
    },
    {
        id: 15,
        name: "Sunglasses",
        category: "accessories",
        price: 1999,
        stock: 45,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop",
        description: "UV protection sunglasses",
        badge: "",
        discount: 0
    },
    {
        id: 16,
        name: "Formal Trousers",
        category: "men",
        price: 3299,
        stock: 32,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
        description: "Professional dress pants",
        badge: "",
        discount: 0
    },
    {
        id: 17,
        name: "Cashmere Sweater",
        category: "women",
        price: 6999,
        stock: 15,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
        description: "Soft cashmere sweater",
        badge: "new",
        discount: 0
    },
    {
        id: 18,
        name: "Canvas Backpack",
        category: "accessories",
        price: 2799,
        stock: 38,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
        description: "Durable canvas backpack",
        badge: "bestseller",
        discount: 0
    },
    {
        id: 19,
        name: "Hooded Sweatshirt",
        category: "men",
        price: 2699,
        stock: 48,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
        description: "Comfortable hoodie",
        badge: "",
        discount: 0
    },
    {
        id: 20,
        name: "Wrap Blouse",
        category: "women",
        price: 2299,
        stock: 25,
        image: "https://images.unsplash.com/photo-1564257577-1c4d96283e3d?w=400&h=500&fit=crop",
        description: "Elegant wrap-style blouse",
        badge: "",
        discount: 0
    },
    {
        id: 21,
        name: "Leather Belt",
        category: "accessories",
        price: 1499,
        stock: 65,
        image: "https://images.unsplash.com/photo-1624222247344-550fb60583d1?w=400&h=500&fit=crop",
        description: "Genuine leather belt",
        badge: "",
        discount: 0
    },
    {
        id: 22,
        name: "Cargo Shorts",
        category: "men",
        price: 1999,
        stock: 42,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop",
        description: "Multi-pocket cargo shorts",
        badge: "sale",
        discount: 15
    },
    {
        id: 23,
        name: "Linen Pants",
        category: "women",
        price: 3199,
        stock: 22,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        description: "Breathable linen pants",
        badge: "new",
        discount: 0
    },
    {
        id: 24,
        name: "Wrist Watch",
        category: "accessories",
        price: 4999,
        stock: 20,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=500&fit=crop",
        description: "Classic analog watch",
        badge: "bestseller",
        discount: 0
    },
    {
        id: 25,
        name: "V-Neck Sweater",
        category: "men",
        price: 2899,
        stock: 35,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
        description: "Knitted v-neck sweater",
        badge: "",
        discount: 0
    },
    {
        id: 26,
        name: "Midi Pencil Skirt",
        category: "women",
        price: 2199,
        stock: 30,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
        description: "Professional pencil skirt",
        badge: "",
        discount: 0
    },
    {
        id: 27,
        name: "Crossbody Bag",
        category: "accessories",
        price: 2499,
        stock: 33,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
        description: "Compact crossbody bag",
        badge: "",
        discount: 0
    },
    {
        id: 28,
        name: "Bomber Jacket",
        category: "men",
        price: 5499,
        stock: 16,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        description: "Classic bomber jacket",
        badge: "new",
        discount: 0
    },
    {
        id: 29,
        name: "Turtleneck Top",
        category: "women",
        price: 1899,
        stock: 40,
        image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=500&fit=crop",
        description: "Cozy turtleneck top",
        badge: "",
        discount: 0
    },
    {
        id: 30,
        name: "Baseball Cap",
        category: "accessories",
        price: 999,
        stock: 75,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
        description: "Adjustable baseball cap",
        badge: "bestseller",
        discount: 0
    }
];

let editingProductId = null;

// ==================== DOM Elements ====================
const productModal = document.getElementById('product-modal');
const deleteModal = document.getElementById('delete-modal');
const productForm = document.getElementById('product-form');
const productsTableBody = document.getElementById('products-table-body');
const btnAddProduct = document.getElementById('btn-add-product');
const modalClose = document.getElementById('modal-close');
const btnCancel = document.getElementById('btn-cancel');
const deleteModalClose = document.getElementById('delete-modal-close');
const btnDeleteCancel = document.getElementById('btn-delete-cancel');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
const modalTitle = document.getElementById('modal-title');
const submitText = document.getElementById('submit-text');
const totalProductsEl = document.getElementById('total-products');

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateStats();
});

// ==================== Load Products ====================
function loadProducts() {
    productsTableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-image-cell">
            </td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>₹${product.price.toLocaleString('en-IN')}</td>
            <td>${product.stock}</td>
            <td>
                <span class="product-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-delete" onclick="confirmDelete(${product.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// ==================== Update Stats ====================
function updateStats() {
    totalProductsEl.textContent = products.length;
}

// ==================== Get Category Name ====================
function getCategoryName(category) {
    const categories = {
        'men': "Men's Wear",
        'women': "Women's Wear",
        'accessories': 'Accessories'
    };
    return categories[category] || category;
}

// ==================== Open Add Product Modal ====================
btnAddProduct.addEventListener('click', () => {
    editingProductId = null;
    productForm.reset();
    modalTitle.textContent = 'Add New Product';
    submitText.textContent = 'Add Product';
    productModal.classList.add('active');
});

// ==================== Close Modals ====================
modalClose.addEventListener('click', () => {
    productModal.classList.remove('active');
});

btnCancel.addEventListener('click', () => {
    productModal.classList.remove('active');
});

deleteModalClose.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

btnDeleteCancel.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});

// ==================== Edit Product ====================
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    modalTitle.textContent = 'Edit Product';
    submitText.textContent = 'Update Product';
    
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-discount').value = product.discount || 0;
    
    productModal.classList.add('active');
}

// ==================== Submit Form ====================
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseInt(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        badge: document.getElementById('product-badge').value,
        discount: parseInt(document.getElementById('product-discount').value) || 0
    };
    
    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            ...productData
        };
        products.push(newProduct);
        showNotification('Product added successfully!', 'success');
    }
    
    loadProducts();
    updateStats();
    productModal.classList.remove('active');
    productForm.reset();
    
    // Save to localStorage
    saveToLocalStorage();
});

// ==================== Confirm Delete ====================
function confirmDelete(id) {
    editingProductId = id;
    deleteModal.classList.add('active');
}

// ==================== Delete Product ====================
btnDeleteConfirm.addEventListener('click', () => {
    if (editingProductId) {
        products = products.filter(p => p.id !== editingProductId);
        loadProducts();
        updateStats();
        deleteModal.classList.remove('active');
        showNotification('Product deleted successfully!', 'success');
        
        // Save to localStorage
        saveToLocalStorage();
    }
});

// ==================== Local Storage ====================
function saveToLocalStorage() {
    localStorage.setItem('lumo_products', JSON.stringify(products));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('lumo_products');
    if (saved) {
        products = JSON.parse(saved);
    }
}

// Load from localStorage on init
loadFromLocalStorage();

// ==================== Notification ====================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
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
`;
document.head.appendChild(style);

// ==================== Logout ====================
document.querySelector('.btn-logout-admin').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
});
