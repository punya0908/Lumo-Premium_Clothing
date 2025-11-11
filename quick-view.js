// ==================== Quick View Functionality ====================

// Open quick view modal
function openQuickView(imageSrc, title, price) {
    const modal = document.getElementById('quickViewModal');
    const image = document.getElementById('quickViewImage');
    const titleElement = document.getElementById('quickViewTitle');
    const priceElement = document.getElementById('quickViewPrice');
    
    if (modal && image && titleElement && priceElement) {
        image.src = imageSrc;
        image.alt = title;
        titleElement.textContent = title;
        priceElement.textContent = price;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

// Close quick view modal
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize quick view functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all product images
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productImage = card.querySelector('.product-image img, .product-image');
        
        if (productImage) {
            // Make the entire product image clickable for quick view
            productImage.style.cursor = 'pointer';
            
            productImage.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons
                if (e.target.tagName === 'BUTTON') return;
                
                const img = card.querySelector('img');
                const title = card.querySelector('h4, .product-name')?.textContent || 'Product';
                const price = card.querySelector('.price-current, .current-price')?.textContent || '';
                
                if (img) {
                    openQuickView(img.src, title, price);
                }
            });
        }
    });
    
    // Close modal when clicking outside the image
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuickView();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
});
