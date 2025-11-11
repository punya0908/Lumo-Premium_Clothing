// ==================== Hero Slider Functionality ====================
// Only initialize if slider elements exist on the page
if (document.querySelector('.hero-slide')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Slider controls
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            currentSlide = index;
            showSlide(currentSlide);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
}

// ==================== User Authentication State ====================
let isUserLoggedIn = false; // This will track if user is logged in

// ==================== Protected Pages Check ====================
function checkProtectedPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['collections.html', 'new-arrivals.html'];
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    console.log('Current page:', currentPage, 'Is logged in:', isLoggedIn); // Debug log
    
    if (protectedPages.includes(currentPage) && isLoggedIn !== 'true') {
        console.log('Redirecting to login - protected page accessed while logged out'); // Debug log
        // Store the intended destination
        localStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

// Call this immediately before anything else
if (!checkProtectedPage()) {
    // Stop execution if redirecting
    throw new Error('Redirecting to login');
}

// ==================== Check Login Status on Page Load ====================
async function checkLoginStatus() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    console.log('Checking login status:', { loggedIn, userId, userEmail }); // Debug log
    
    if (loggedIn === 'true') {
        isUserLoggedIn = true;
        const profileBtn = document.querySelector('.btn-profile');
        const profileName = document.querySelector('.profile-name');
        const dropdownUserName = document.querySelector('.dropdown-header .user-name');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileSvg = profileBtn ? profileBtn.querySelector('svg') : null;
        
        console.log('User is logged in'); // Debug log
        
        // Ensure dropdown is visible for logged-in users
        if (profileDropdown) {
            profileDropdown.style.display = '';
        }
        
        // Ensure profile name is visible
        if (profileName) {
            profileName.style.display = '';
        }
        
        // Reset to profile icon (in case it was changed to login icon)
        if (profileSvg) {
            profileSvg.innerHTML = `
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            `;
        }
        
        if (profileBtn && profileName) {
            // Try to fetch fresh data from Supabase
            if (window.supabaseClient && userId) {
                try {
                    const { data: profile, error } = await window.supabaseClient
                        .from('profiles')
                        .select('first_name, last_name')
                        .eq('id', userId)
                        .single();
                    
                    if (!error && profile && profile.first_name) {
                        const fullName = `${profile.first_name} ${profile.last_name}`;
                        profileName.textContent = profile.first_name;
                        if (dropdownUserName) dropdownUserName.textContent = fullName;
                        
                        // Update localStorage with fresh data
                        localStorage.setItem('userFirstName', profile.first_name);
                        localStorage.setItem('userName', fullName);
                        return;
                    }
                } catch (err) {
                    console.log('Could not fetch profile from Supabase:', err);
                }
            }
            
            // Fallback to localStorage
            const firstName = localStorage.getItem('userFirstName');
            const userName = localStorage.getItem('userName');
            
            if (firstName || userName) {
                const displayName = firstName || userName.split(' ')[0];
                profileName.textContent = displayName;
                if (dropdownUserName) dropdownUserName.textContent = userName || displayName;
            } else {
                // Don't show anything if no name available
                profileName.textContent = '';
            }
        }
    } else {
        // User not logged in - show login icon and hide dropdown
        isUserLoggedIn = false;
        console.log('User is logged out'); // Debug log
        
        const profileBtn = document.querySelector('.btn-profile');
        const profileSvg = profileBtn ? profileBtn.querySelector('svg') : null;
        const profileName = document.querySelector('.profile-name');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const dropdownUserName = document.querySelector('.dropdown-header .user-name');
        
        if (profileBtn) {
            // Hide the name text
            if (profileName) {
                profileName.style.display = 'none';
            }
            
            // Change to login icon
            if (profileSvg) {
                profileSvg.innerHTML = `
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                `;
            }
            
            // Hide dropdown menu
            if (profileDropdown) {
                profileDropdown.style.display = 'none';
            }
            
            // Reset dropdown header
            if (dropdownUserName) {
                dropdownUserName.textContent = 'Welcome';
            }
            
            // Remove any existing click handlers and add new one
            const newProfileBtn = profileBtn.cloneNode(true);
            profileBtn.parentNode.replaceChild(newProfileBtn, profileBtn);
            
            newProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'auth.html';
            });
        }
    }
}

// ==================== Logout Function ====================
async function handleLogout() {
    console.log('Logging out...'); // Debug log
    
    // Sign out from Supabase if available
    if (window.supabaseClient) {
        try {
            await window.supabaseClient.auth.signOut();
        } catch (err) {
            console.log('Supabase signout error:', err);
        }
    }
    
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userId');
    localStorage.removeItem('rememberMe');
    
    // Set flag for logged out state
    isUserLoggedIn = false;
    
    console.log('Redirecting with reload...'); // Debug log
    
    // Get current page to check if it's a protected page
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['collections.html', 'new-arrivals.html'];
    
    // If on a protected page, redirect to home, otherwise reload current page
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
    } else {
        // Reload current page to refresh UI state
        window.location.reload();
    }
}

// Use event delegation for logout button (works even if button added dynamically)
document.addEventListener('click', async (e) => {
    // Check if clicked element or its parent is the logout button
    const logoutBtn = e.target.closest('.logout-btn');
    if (logoutBtn) {
        console.log('Logout button clicked'); // Debug log
        e.preventDefault();
        e.stopPropagation();
        await handleLogout();
    }
});

// Handle logout
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    
    // Call checkLoginStatus when DOM is ready
    checkLoginStatus();
});

// Also call on window load as backup
window.addEventListener('load', () => {
    checkLoginStatus();
});

// Listen for storage changes (logout from another tab/window)
window.addEventListener('storage', (e) => {
    if (e.key === 'isLoggedIn' || e.key === null) {
        // Storage was cleared or isLoggedIn changed
        checkLoginStatus();
    }
});

// ==================== Mobile Menu Toggle ====================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ==================== Smooth Scrolling with Auth Check ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Check if link requires authentication
        if (this.classList.contains('auth-required') && !isUserLoggedIn) {
            showLoginPrompt();
            return;
        }
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ==================== Shopping Cart Functionality ====================
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.btn-add-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if user is logged in before adding to cart
        if (!isUserLoggedIn) {
            showLoginPrompt();
            return;
        }
        
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        // Add animation
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
        
        // Change button text temporarily
        const originalText = button.textContent;
        button.textContent = 'Added! ✓';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    });
});

// ==================== Wishlist Functionality ====================
const wishlistButtons = document.querySelectorAll('.product-wishlist');

wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            button.textContent = '♥';
            button.style.color = '#e74c3c';
        } else {
            button.textContent = '♡';
            button.style.color = '';
        }
    });
});

// ==================== Newsletter Form ====================
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (email) {
        // Show success message
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Subscribed! ✓';
        button.style.background = '#27ae60';
        
        emailInput.value = '';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
});

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.feature-card, .category-card, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== Search Functionality ====================
const searchButton = document.querySelector('.btn-search');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        // Search functionality - could implement search modal here
        console.log('Search clicked');
    });
}

// ==================== Navbar Scroll Effect ====================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// ==================== Category and Product Interactions ====================
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!isUserLoggedIn) {
            showLoginPrompt();
            return;
        }
        
        const categoryName = card.querySelector('h3').textContent;
        console.log(`Navigating to ${categoryName} category`);
        // Navigate to collections page
        window.location.href = 'collections.html';
    });
});

// ==================== Login Prompt Function ====================
function showLoginPrompt() {
    // Redirect directly to login page
    window.location.href = 'auth.html';
}

// ==================== Login Button ====================
const loginButton = document.querySelector('.btn-login');

if (loginButton) {
    loginButton.addEventListener('click', () => {
        if (!isUserLoggedIn) {
            // Redirect to auth page
            window.location.href = 'auth.html';
        } else {
            // If already logged in, show account options
            const logoutConfirm = confirm('You are logged in. Would you like to log out?');
            if (logoutConfirm) {
                isUserLoggedIn = false;
                localStorage.clear();
                loginButton.textContent = 'Login';
                loginButton.style.background = '';
                
                // Reload page to reset state
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }
    });
}

// ==================== View All Products Button ====================
const viewAllButton = document.querySelector('.btn-view-all');

if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
        if (!isUserLoggedIn) {
            showLoginPrompt();
        } else {
            window.location.href = 'collections.html';
        }
    });
}

// ==================== Promo Banner CTA ====================
const promoBannerButton = document.querySelector('.promo-banner .btn-primary');

if (promoBannerButton) {
    promoBannerButton.addEventListener('click', () => {
        window.location.href = 'collections.html';
    });
}

// ==================== Hero CTA Buttons ====================
const heroButtons = document.querySelectorAll('.hero-buttons button');

heroButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent;
        console.log(`User clicked: ${action}`);
        
        if (action.includes('Shop')) {
            if (!isUserLoggedIn) {
                showLoginPrompt();
            } else {
                window.location.href = 'collections.html';
            }
        } else if (action.includes('Explore') || action.includes('Learn') || action.includes('View')) {
            if (!isUserLoggedIn) {
                showLoginPrompt();
            } else {
                window.location.href = 'new-arrivals.html';
            }
        }
    });
});

// ==================== Cart Button ====================
const cartButton = document.querySelector('.btn-cart');

if (cartButton) {
    cartButton.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

// ==================== Performance: Lazy Loading Images ====================
// When you add real images, you can use this for lazy loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Lumo E-Commerce Website Loaded Successfully!');
    console.log('Ready for shopping experience...');
});

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
    // Arrow key navigation for slider
    if (e.key === 'ArrowLeft') {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    } else if (e.key === 'ArrowRight') {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    }
});
