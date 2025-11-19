// AI Chat Widget with Email Integration and Tidio Support
class AIChatWidget {
    constructor() {
        this.conversationHistory = [];
        this.userEmail = '';
        this.userName = '';
        this.isEmailFormVisible = false;
        this.WEB3FORMS_KEY = '8d3bfe1c-3eb9-44f7-981c-b34b7b702e99';
        this.useTidio = false; // Set to true to use Tidio for responses
        this.tidioReady = false;
        this.tidioTimeout = null;
        
        this.init();
        this.checkTidioAvailability();
    }

    init() {
        this.injectHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    checkTidioAvailability() {
        // Check if Tidio is loaded
        const checkInterval = setInterval(() => {
            if (window.tidioChatApi) {
                this.tidioReady = true;
                this.useTidio = true;
                clearInterval(checkInterval);
                console.log('Tidio AI integration enabled');
                
                // Update status
                const statusEl = document.getElementById('chatStatus');
                if (statusEl) {
                    statusEl.innerHTML = 'Smart AI Ready 🤖';
                }
                
                // Hide Tidio's default widget since we're using our custom one
                if (window.tidioChatApi.hide) {
                    window.tidioChatApi.hide();
                }
                
                // Listen to Tidio messages
                this.setupTidioListeners();
            }
        }, 500);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.tidioReady) {
                console.log('Tidio not available, using built-in responses');
            }
        }, 10000);
    }

    setupTidioListeners() {
        // Listen for Tidio visitor messages
        window.tidioChatApi.on('messageFromVisitor', (data) => {
            // Message already added by our sendMessage function
        });
        
        // Listen for Tidio operator/bot messages
        window.tidioChatApi.on('messageFromOperator', (data) => {
            if (data && data.message) {
                // Clear timeout if exists
                if (this.tidioTimeout) {
                    clearTimeout(this.tidioTimeout);
                    this.tidioTimeout = null;
                }
                
                this.removeTypingIndicator();
                this.addMessage(data.message, true);
            }
        });
    }

    injectHTML() {
        const widgetHTML = `
            <div class="ai-chat-widget">
                <button class="chat-toggle-btn" id="chatToggleBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>

                <div class="chat-container" id="chatContainer">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <h3>Lumo AI Assistant</h3>
                            <p id="chatStatus">We're here to help! 💬</p>
                        </div>
                        <button class="chat-close-btn" id="chatCloseBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="chat-messages" id="chatMessages"></div>

                    <div class="chat-input-area">
                        <div class="email-form" id="emailForm">
                            <input type="text" id="userNameInput" placeholder="Your name" required>
                            <input type="email" id="userEmailInput" placeholder="Your email" required>
                            <div class="email-form-buttons">
                                <button class="btn-send" id="sendEmailBtn">Send Summary</button>
                                <button class="btn-cancel" id="cancelEmailBtn">Cancel</button>
                            </div>
                        </div>

                        <div class="chat-input-wrapper">
                            <textarea 
                                class="chat-input" 
                                id="chatInput" 
                                placeholder="Type your message..."
                                rows="1"
                            ></textarea>
                            <button class="chat-email-btn" id="emailToggleBtn" title="Get chat summary via email">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button class="chat-send-btn" id="chatSendBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>

                        <div class="quick-actions" id="quickActions">
                            <button class="quick-action-btn" data-message="What are your shipping options?">Shipping info</button>
                            <button class="quick-action-btn" data-message="How can I track my order?">Track order</button>
                            <button class="quick-action-btn" data-message="What is your return policy?">Return policy</button>
                            <button class="quick-action-btn" data-message="Do you have custom colors?">Custom colors</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        // Toggle chat
        document.getElementById('chatToggleBtn').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatCloseBtn').addEventListener('click', () => this.handleChatClose());

        // Send message
        document.getElementById('chatSendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('chatInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });

        // Email form
        document.getElementById('emailToggleBtn').addEventListener('click', () => this.toggleEmailForm());
        document.getElementById('sendEmailBtn').addEventListener('click', () => this.sendEmailSummary());
        document.getElementById('cancelEmailBtn').addEventListener('click', () => this.toggleEmailForm());

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                document.getElementById('chatInput').value = message;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        const container = document.getElementById('chatContainer');
        container.classList.toggle('active');
    }

    async handleChatClose() {
        // Check if there's any conversation history (excluding welcome message)
        const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
        
        if (userMessages.length > 0 && !this.userEmail) {
            // User has had a conversation but hasn't provided email yet
            const wantsEmail = confirm('Would you like to receive a summary of this conversation via email? Our team will review your queries and get back to you soon!');
            
            if (wantsEmail) {
                // Show email form
                this.toggleEmailForm();
                return; // Don't close the chat yet
            }
        }
        
        // Close the chat
        this.toggleChat();
    }

    toggleEmailForm() {
        const form = document.getElementById('emailForm');
        this.isEmailFormVisible = !this.isEmailFormVisible;
        if (this.isEmailFormVisible) {
            form.classList.add('active');
            document.getElementById('quickActions').style.display = 'none';
        } else {
            form.classList.remove('active');
            document.getElementById('quickActions').style.display = 'flex';
        }
    }

    addMessage(content, isBot = true) {
        const messagesContainer = document.getElementById('chatMessages');
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message ${isBot ? 'bot' : 'user'}">
                <div class="message-content">
                    ${content}
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to conversation history
        this.conversationHistory.push({
            role: isBot ? 'assistant' : 'user',
            content: content,
            time: time
        });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, false);
        input.value = '';
        input.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // First, try to answer with built-in responses
        const builtInResponse = this.checkBuiltInResponse(message);
        
        if (builtInResponse) {
            // We have a built-in answer, use it
            setTimeout(() => {
                this.removeTypingIndicator();
                this.addMessage(builtInResponse, true);
            }, 800 + Math.random() * 500);
        } else {
            // Question is outside our set, ask Tidio
            if (this.tidioReady && window.tidioChatApi) {
                try {
                    // Send message to Tidio for advanced AI processing
                    window.tidioChatApi.sendMessage(message);
                    
                    // Tidio will respond via the messageFromOperator listener
                    // Set a timeout in case Tidio doesn't respond
                    this.tidioTimeout = setTimeout(() => {
                        this.removeTypingIndicator();
                        this.addMessage("Thank you for your question! Our team will review it and get back to you soon. Would you like to receive an email summary of our conversation? Click the email icon! 📧", true);
                    }, 8000);
                } catch (error) {
                    console.error('Tidio error:', error);
                    this.removeTypingIndicator();
                    this.addMessage("Thank you for your question! Our team will review it and get back to you soon. Would you like to receive an email summary? Click the email icon! 📧", true);
                }
            } else {
                // Tidio not available, show fallback
                setTimeout(() => {
                    this.removeTypingIndicator();
                    this.addMessage("Thank you for your question! Our team will review it and provide you with a detailed response. Would you like to receive an email summary of our conversation? Click the email icon! 📧", true);
                }, 800);
            }
        }
    }

    checkBuiltInResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Check if message matches our built-in question set
        if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days, and express delivery is available for 1-2 days. Would you like to know more about international shipping?";
        } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return "We have a 30-day return policy for unworn items with tags attached. Returns are free, and refunds are processed within 5-7 business days. Would you like help initiating a return?";
        } else if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
            return "You can track your order using the tracking link sent to your email. If you need help finding it, please provide your order number and I'll assist you!";
        } else if (lowerMessage.includes('custom') || lowerMessage.includes('color')) {
            return "Yes! We offer custom color options for many of our products. You can submit a custom color request <a href='custom-request.html' style='color: #667eea; text-decoration: underline;'>here</a>, and we'll get back to you within 24 hours.";
        } else if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
            return "We offer sizes from XS to XXL. Check our size guide for detailed measurements. If you're between sizes, we generally recommend sizing up for a more comfortable fit. Need specific measurements?";
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('sale')) {
            return "Our products range from $29 to $199. We frequently have sales and special offers! Subscribe to our newsletter to get notified about exclusive deals and early access to sales.";
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! 👋 Welcome to Lumo Premium Clothing! How can I help you today? Feel free to ask about our products, shipping, returns, or anything else!";
        } else if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with today? If you'd like, I can send you a summary of our conversation via email! 📧";
        } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            return "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure. Need help with a payment issue?";
        } else if (lowerMessage.includes('exchange')) {
            return "We offer free exchanges within 30 days! Just contact us with your order number and we'll help you find the perfect replacement. The exchange process is quick and easy.";
        } else if (lowerMessage.includes('material') || lowerMessage.includes('fabric')) {
            return "Our products are made from premium materials including cotton, linen, silk, and sustainable fabrics. Each product page lists the specific material composition. Want details about a specific item?";
        } else if (lowerMessage.includes('sustainability') || lowerMessage.includes('sustainable') || lowerMessage.includes('eco')) {
            return "We're committed to sustainable fashion! We use eco-friendly materials, ethical manufacturing, and recyclable packaging. Many of our collections are made from organic and recycled materials.";
        }
        
        // No built-in response found
        return null;
    }

    addWelcomeMessage() {
        setTimeout(() => {
            const welcomeMsg = this.tidioReady 
                ? "Hi! 👋 Welcome to Lumo Premium Clothing! I'm your AI assistant with advanced capabilities. How can I help you today?"
                : "Hi! 👋 Welcome to Lumo Premium Clothing! I'm your AI assistant. How can I help you today?";
            this.addMessage(welcomeMsg, true);
        }, 1500); // Longer delay to allow Tidio to load
    }

    async sendEmailSummary() {
        const nameInput = document.getElementById('userNameInput');
        const emailInput = document.getElementById('userEmailInput');
        const sendBtn = document.getElementById('sendEmailBtn');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name || !email) {
            alert('Please enter your name and email');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        this.userName = name;
        this.userEmail = email;

        // Update button state
        const originalText = sendBtn.textContent;
        sendBtn.textContent = 'Sending...';
        sendBtn.disabled = true;

        try {
            // Generate conversation summary
            const summary = this.generateConversationSummary();

            // Prepare email content
            const formData = new FormData();
            formData.append('access_key', this.WEB3FORMS_KEY);
            formData.append('subject', 'Lumo AI Chat Summary - We\'ll Get Back to You Soon!');
            formData.append('from_name', 'Lumo Premium Clothing');
            formData.append('to', email);
            formData.append('name', name);
            formData.append('message', summary);

            // Send email via Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.addMessage(`✅ Great! I've sent a summary of our conversation to ${email}. Our team will review your queries and get back to you soon!`, true);
                this.toggleEmailForm();
                nameInput.value = '';
                emailInput.value = '';
                
                // Close chat after 2 seconds
                setTimeout(() => {
                    this.toggleChat();
                }, 2000);
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Email sending error:', error);
            this.addMessage('❌ Sorry, there was an error sending the email. Please try again or contact us directly.', true);
        } finally {
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    }

    generateConversationSummary() {
        const conversationText = this.conversationHistory
            .map(msg => `${msg.role === 'user' ? 'Customer' : 'AI Assistant'} (${msg.time}): ${msg.content}`)
            .join('\n\n');

        const summary = `
Hello ${this.userName},

Thank you for chatting with Lumo Premium Clothing! Below is a summary of our conversation:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${conversationText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 NEXT STEPS:

Our customer service team has received your queries and will review them carefully. We will get back to you with detailed answers and personalized assistance soon!

Expected response time: Within 24 hours
Your email: ${this.userEmail}

In the meantime, feel free to:
• Browse our collections: https://lumo.com/collections
• Check our FAQ: https://lumo.com/faq
• Track your order: https://lumo.com/track-order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Lumo Premium Clothing!

Best regards,
The Lumo Team

---
This is an automated message from Lumo AI Assistant.
For immediate assistance, please call us at 1-800-LUMO-STYLE
        `.trim();

        return summary;
    }
}

// Initialize the chat widget when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        new AIChatWidget();
    }, 500);
});
