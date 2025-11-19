# AI Chat Widget with Email Integration & Hybrid AI Workflow

## Overview
Custom AI chat widget with a smart hybrid workflow: handles common questions instantly with built-in responses, and uses Tidio AI for complex or unknown questions. All conversations can be sent as email summaries via Web3Forms.

## Features

### 🎯 Hybrid AI Workflow (NEW!)

**Smart Question Routing:**
1. **User asks a question** → System checks built-in knowledge base first
2. **If question matches** (shipping, returns, sizes, etc.) → **Instant built-in response**
3. **If question is unknown** → **Routes to Tidio AI** for intelligent processing
4. **Tidio responds** → Response appears in custom chat interface

**Built-in Question Set:**
- Shipping & delivery
- Returns & refunds
- Order tracking
- Custom colors
- Sizes & fit
- Pricing & sales
- Payment methods
- Exchanges
- Materials & fabrics
- Sustainability
- General greetings

**Tidio AI Handles:**
- Product-specific questions
- Complex inquiries
- Multi-part questions
- Context-based follow-ups
- Anything outside the built-in set

### 💬 Real-time Chat Interface
- Beautiful, modern chat UI with purple gradient design
- Typing indicators for better UX
- Auto-scrolling messages
- Quick action buttons for common queries
- Mobile responsive design

### 📧 Email Summary Feature
- Users can request a chat summary via email
- Automatically formats the entire conversation
- Includes timestamp for each message
- Adds professional closing message: "We will be getting back to you with your query soon"
- Sends via Web3Forms API

### 🤖 AI Responses
The chat includes pre-programmed responses for:
- Shipping and delivery questions
- Return and refund policy
- Order tracking
- Custom color requests
- Size and fit guidance
- Pricing and sales information
- General greetings

## How It Works

### Tidio AI Integration Flow

**When Tidio is Available:**
1. Widget checks for Tidio API on page load
2. If found, automatically integrates with Tidio
3. User messages are sent to Tidio AI
4. Tidio processes with advanced AI (not just keywords!)
5. Responses appear in custom chat interface
6. Header shows "Powered by AI 🤖" status

**When Tidio is Not Available:**
1. Widget falls back to built-in keyword responses
2. Still fully functional with pre-programmed answers
3. Email summary feature works regardless

### 1. User Interaction
Users can:
- Click the purple chat bubble in the bottom-right corner
- Type messages or use quick action buttons
- Get instant AI responses

### 2. Email Summary Process
1. User clicks the email icon (📧) in the chat input area
2. Email form appears asking for name and email
3. User enters details and clicks "Send Summary"
4. System generates a formatted conversation summary
5. Email is sent via Web3Forms with:
   - Full chat transcript with timestamps
   - Professional header and footer
   - Message: "Our team will review your queries and get back to you soon"
   - Expected response time: Within 24 hours

### 3. Email Content Structure
```
Hello [User Name],

Thank you for chatting with Lumo Premium Clothing!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full conversation with timestamps]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 NEXT STEPS:

Our customer service team has received your queries and will
review them carefully. We will get back to you with detailed
answers and personalized assistance soon!

Expected response time: Within 24 hours
```

## Installation

### Files Added
- `ai-chat.css` - Styling for the chat widget
- `ai-chat.js` - Chat functionality and logic
- `AI_CHAT_GUIDE.md` - This documentation

### Integration
The widget is automatically loaded on:
- `index.html`

To add to other pages, include before the closing `</body>` tag:
```html
<!-- AI Chat Widget -->
<link rel="stylesheet" href="ai-chat.css">
<script src="ai-chat.js"></script>
```

## Customization

### Change AI Responses
Edit the `generateAIResponse()` method in `ai-chat.js`:
```javascript
generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('your-keyword')) {
        return "Your custom response";
    }
    // Add more conditions...
}
```

### Integrate Real AI API
Replace the `generateAIResponse()` method with an actual API call:
```javascript
async generateAIResponse(userMessage) {
    const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    return data.reply;
}
```

### Modify Email Template
Edit the `generateConversationSummary()` method in `ai-chat.js` to customize the email format.

### Change Colors
Update the gradient colors in `ai-chat.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Quick Actions
Modify quick action buttons in the `injectHTML()` method:
```html
<button class="quick-action-btn" data-message="Your question">Button Text</button>
```

## Web3Forms Configuration

The widget uses your existing Web3Forms access key:
```javascript
this.WEB3FORMS_KEY = '8d3bfe1c-3eb9-44f7-981c-b34b7b702e99';
```

## Usage Tips

### For Customers
1. Click the chat icon to start a conversation
2. Ask questions or use quick actions
3. Click the email icon (📧) to get a summary
4. Enter your name and email
5. Receive summary and wait for team response

### For Admins
- Check your Web3Forms dashboard for incoming chat summaries
- Review customer queries and respond via email
- Monitor common questions to improve AI responses

## Disabling Tidio

If you want to use only the custom AI chat, Tidio is now commented out in `index.html`:
```html
<!-- Tidio AI Assistant (you can disable this if using the custom AI chat) -->
<!-- <script src="https://code.tidio.co/..."></script> -->
```

To re-enable Tidio, uncomment those lines.

## Mobile Support

The chat widget is fully responsive:
- Adjusts to screen size
- Touch-friendly buttons
- Optimized layout for mobile devices

## Browser Support

Works on all modern browsers:
- Chrome, Firefox, Edge, Safari
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Future Enhancements

Possible improvements:
- Integrate with OpenAI/ChatGPT API for smarter responses
- Add file attachment support
- Save chat history to database
- Add sentiment analysis
- Multi-language support
- Chat ratings and feedback

## Support

For issues or questions about the chat widget, contact your development team.

---

**Last Updated:** November 18, 2025  
**Version:** 1.0.0
