// ==================== Filter Functionality ====================
document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter products
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Sidebar category checkboxes
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    
    if (categoryCheckboxes.length > 0) {
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedCategories = Array.from(categoryCheckboxes)
                    .filter(cb => cb.checked && cb.getAttribute('data-category') !== 'all')
                    .map(cb => cb.getAttribute('data-category'));
                
                const allCheckbox = document.querySelector('.filter-checkbox input[data-category="all"]');
                
                // If "All Products" is checked or no categories selected, show all
                if (allCheckbox && allCheckbox.checked || selectedCategories.length === 0) {
                    productCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    productCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        
                        if (selectedCategories.includes(category)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
                
                updateProductCount();
            });
        });
    }

    // Price range slider
    const priceSlider = document.querySelector('.price-slider');
    const maxPriceDisplay = document.querySelector('.max-price');
    
    if (priceSlider && maxPriceDisplay) {
        priceSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            maxPriceDisplay.textContent = `₹${parseInt(value).toLocaleString('en-IN')}`;
            
            // Filter products by price
            productCards.forEach(card => {
                const priceText = card.querySelector('.current-price').textContent;
                const price = parseInt(priceText.replace(/[₹,]/g, ''));
                
                if (price <= value) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            updateProductCount();
        });
    }

    // Size selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color selection
    const colorBtns = document.querySelectorAll('.color-btn');
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Clear all filters
    const clearFiltersBtn = document.querySelector('.btn-clear-filters');
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Reset checkboxes
            categoryCheckboxes.forEach(cb => {
                if (cb.getAttribute('data-category') === 'all') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            
            // Reset price slider
            if (priceSlider) {
                priceSlider.value = priceSlider.max;
                maxPriceDisplay.textContent = `₹${parseInt(priceSlider.max).toLocaleString('en-IN')}`;
            }
            
            // Reset size selection
            sizeBtns.forEach(btn => btn.classList.remove('active'));
            
            // Reset color selection
            colorBtns.forEach(btn => btn.classList.remove('active'));
            
            // Show all products
            productCards.forEach(card => {
                card.style.display = 'block';
            });
            
            updateProductCount();
        });
    }

    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            const productsGrid = document.querySelector('.products-grid');
            const productsArray = Array.from(productCards);
            
            productsArray.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.current-price').textContent.replace(/[₹,]/g, ''));
                const priceB = parseInt(b.querySelector('.current-price').textContent.replace(/[₹,]/g, ''));
                const ratingA = a.querySelector('.stars').textContent.length;
                const ratingB = b.querySelector('.stars').textContent.length;
                
                switch(sortValue) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'popular':
                        return ratingB - ratingA;
                    case 'newest':
                        return a.querySelector('.product-badge.new') ? -1 : 1;
                    default:
                        return 0;
                }
            });
            
            // Re-append sorted products
            productsArray.forEach(card => {
                productsGrid.appendChild(card);
            });
        });
    }

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const currentCount = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = currentCount + 1;
            }
            
            // Visual feedback
            btn.textContent = 'Added! ✓';
            btn.style.background = '#10b981';
            
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.style.background = '';
            }, 2000);
            
            console.log(`Added to cart: ${productName} - ${productPrice}`);
        });
    });

    // Quick view functionality
    const quickViewBtns = document.querySelectorAll('.btn-quick-view');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            // TODO: Open modal with product details
            console.log(`Quick view: ${productName}`);
            alert(`Quick view feature coming soon for: ${productName}`);
        });
    });

    // Update product count
    function updateProductCount() {
        const visibleProducts = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        ).length;
        
        const resultsInfo = document.querySelector('.results-info');
        if (resultsInfo) {
            resultsInfo.innerHTML = `Showing <strong>${visibleProducts}</strong> products`;
        }
    }
});
