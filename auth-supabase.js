// ==================== Supabase Authentication Manager ====================
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing auth system...');
    
    // Check if Supabase is available
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized!');
        showMessage('error', 'System initialization error. Please refresh the page.');
        return;
    }
    
    console.log('Supabase client ready!');
    initializeAuth();
});

const supabase = window.supabaseClient;

function initializeAuth() {
    console.log('Auth system initialized');
}

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

// ==================== Login Form Submission with Supabase ====================
const loginFormElement = document.getElementById('loginForm');

loginFormElement.addEventListener('submit', async (e) => {
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
    
    const submitButton = loginFormElement.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    try {
        // Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) {
            throw error;
        }
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', data.user.id);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Get user profile data if exists
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (profile) {
            localStorage.setItem('userName', `${profile.first_name} ${profile.last_name}`);
            localStorage.setItem('userFirstName', profile.first_name);
        }
        
        showMessage('success', 'Login successful! Redirecting...');
        
        // Redirect to intended page or home page after 1.5 seconds
        setTimeout(() => {
            const redirectTo = localStorage.getItem('redirectAfterLogin');
            if (redirectTo) {
                localStorage.removeItem('redirectAfterLogin'); // Clear the redirect
                window.location.href = redirectTo;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('error', error.message || 'Login failed. Please check your credentials.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// ==================== Signup Form Submission with Supabase ====================
const signupFormElement = document.getElementById('signupForm');

signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree').checked;
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showMessage('error', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address');
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
    
    const submitButton = signupFormElement.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;
    
    try {
        // Supabase signup
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }
        });
        
        if (error) {
            throw error;
        }
        
        // Create user profile in profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: data.user.id,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                }
            ]);
        
        if (profileError) {
            console.error('Profile creation error:', profileError);
        }
        
        // Store user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        localStorage.setItem('userFirstName', firstName);
        localStorage.setItem('userId', data.user.id);
        
        showMessage('success', 'Account created successfully! Redirecting...');
        
        // Redirect to intended page or home page after 1.5 seconds
        setTimeout(() => {
            const redirectTo = localStorage.getItem('redirectAfterLogin');
            if (redirectTo) {
                localStorage.removeItem('redirectAfterLogin'); // Clear the redirect
                window.location.href = redirectTo;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('error', error.message || 'Signup failed. Please try again.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// ==================== Social Login with Supabase ====================
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const isGoogle = button.classList.contains('google-btn');
        const provider = isGoogle ? 'google' : 'facebook';
        
        button.textContent = `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`;
        button.disabled = true;
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/index.html`
                }
            });
            
            if (error) {
                throw error;
            }
            
            // OAuth will redirect automatically
            
        } catch (error) {
            console.error('Social login error:', error);
            showMessage('error', error.message || 'Social login failed. Please try again.');
            button.textContent = isGoogle ? 'Google' : 'Facebook';
            button.disabled = false;
        }
    });
});

// ==================== Forgot Password with Supabase ====================
const forgotPasswordLink = document.querySelector('.forgot-password');

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = prompt('Enter your email address to reset password:');
        
        if (email && isValidEmail(email)) {
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password.html`,
                });
                
                if (error) {
                    throw error;
                }
                
                showMessage('success', 'Password reset link has been sent to your email!');
            } catch (error) {
                console.error('Password reset error:', error);
                showMessage('error', 'Failed to send reset email. Please try again.');
            }
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
async function checkExistingSession() {
    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User is already logged in
        const redirectConfirm = confirm('You are already logged in. Would you like to go to the home page?');
        if (redirectConfirm) {
            window.location.href = 'index.html';
        } else {
            // Offer to logout
            const logoutConfirm = confirm('Would you like to logout and create a new account?');
            if (logoutConfirm) {
                await supabase.auth.signOut();
                localStorage.clear();
            }
        }
    } else {
        // Check for remember me
        const rememberMe = localStorage.getItem('rememberMe');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (rememberMe === 'true' && savedEmail) {
            const emailInput = document.getElementById('login-email');
            const rememberCheckbox = document.getElementById('remember-me');
            if (emailInput) emailInput.value = savedEmail;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    }
}

// ==================== Form Input Animation ====================
function setupInputAnimations() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement && this.parentElement.parentElement) {
                this.parentElement.parentElement.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', function() {
            if (!this.value && this.parentElement && this.parentElement.parentElement) {
                this.parentElement.parentElement.classList.remove('focused');
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing authentication system...');
    
    // Setup input animations
    setupInputAnimations();
    
    // Check for existing session
    await checkExistingSession();
    
    console.log('Lumo Authentication with Supabase Loaded Successfully!');
});
