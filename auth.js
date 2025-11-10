// ==================== Form Switching ====================
const switchLinks = document.querySelectorAll('.switch-link');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');

switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetForm = link.getAttribute('data-form');
        
        if (targetForm === 'signup') {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        } else {
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        }
    });
});

// ==================== Password Toggle ====================
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            button.innerHTML = `
                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            button.innerHTML = `
                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
});

// ==================== Password Strength Checker ====================
const signupPassword = document.getElementById('signup-password');
const strengthFill = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');

if (signupPassword) {
    signupPassword.addEventListener('input', () => {
        const password = signupPassword.value;
        const strength = calculatePasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        
        if (strength === 0) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Password strength';
            strengthText.style.color = 'var(--text-light)';
        } else if (strength <= 2) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#e74c3c';
        } else if (strength <= 4) {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Medium password';
            strengthText.style.color = '#f39c12';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#27ae60';
        }
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

// ==================== Login Form Submission ====================
const loginFormElement = document.getElementById('loginForm');

loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate inputs
    if (!email || !password) {
        showMessage('error', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    const submitButton = loginFormElement.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showMessage('success', 'Login successful! Redirecting...');
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
});

// ==================== Signup Form Submission ====================
const signupFormElement = document.getElementById('signupForm');

signupFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree').checked;
    
    // Validate inputs
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showMessage('error', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showMessage('error', 'Please enter a valid phone number');
        return;
    }
    
    if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
    }
    
    if (!termsAgree) {
        showMessage('error', 'Please agree to the Terms & Conditions');
        return;
    }
    
    // Simulate signup process
    const submitButton = signupFormElement.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user data
        const userData = {
            firstName,
            lastName,
            email,
            phone
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showMessage('success', 'Account created successfully! Redirecting...');
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
});

// ==================== Social Login Handlers ====================
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('google-btn') ? 'Google' : 'Facebook';
        
        button.textContent = `Connecting to ${provider}...`;
        button.disabled = true;
        
        // Simulate social login
        setTimeout(() => {
            showMessage('success', `${provider} authentication successful! Redirecting...`);
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginProvider', provider);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1500);
    });
});

// ==================== Forgot Password ====================
const forgotPasswordLink = document.querySelector('.forgot-password');

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = prompt('Enter your email address to reset password:');
        
        if (email && isValidEmail(email)) {
            showMessage('success', 'Password reset link has been sent to your email!');
        } else if (email) {
            showMessage('error', 'Please enter a valid email address');
        }
    });
}

// ==================== Helper Functions ====================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>`;
    
    messageDiv.innerHTML = `${icon}<span>${message}</span>`;
    
    // Insert at the top of the active form
    const activeForm = document.querySelector('.form-container.active .auth-form');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ==================== Check if Already Logged In ====================
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        // User is already logged in, redirect to home
        const redirectConfirm = confirm('You are already logged in. Would you like to go to the home page?');
        if (redirectConfirm) {
            window.location.href = 'index.html';
        } else {
            // Offer to logout
            const logoutConfirm = confirm('Would you like to logout and create a new account?');
            if (logoutConfirm) {
                localStorage.clear();
            }
        }
    }
    
    // Check for remember me
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (rememberMe === 'true' && savedEmail) {
        document.getElementById('login-email').value = savedEmail;
        document.getElementById('remember-me').checked = true;
    }
});

// ==================== Form Input Animation ====================
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.parentElement.classList.remove('focused');
        }
    });
});

console.log('Lumo Authentication Page Loaded Successfully!');
