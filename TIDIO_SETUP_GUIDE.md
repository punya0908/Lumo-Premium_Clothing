# Setting Up Tidio AI for Custom Requests

## Option 1: Configure Tidio Bot (Recommended)

### Step 1: Access Tidio Dashboard
1. Go to https://www.tidio.com
2. Login to your account
3. Click on "Chatbots" in the left menu

### Step 2: Create Auto-Response Bot
1. Click "Add a new chatbot"
2. Choose "Support" template or start from scratch
3. Name it "Custom Color Request Bot"

### Step 3: Set Up Trigger
Add a trigger when customer messages contain keywords:
- "different color"
- "other color"
- "custom color"
- "available in"
- "do you have this in"

### Step 4: Create Response Flow
```
When customer asks about colors:
├─ Bot: "I'd be happy to help you with a custom color request! 🎨"
├─ Bot: "Please fill out this quick form and we'll get back to you within 24 hours:"
└─ Bot: [Link to custom-request.html page]
```

### Step 5: Add Quick Response Message
In Tidio dashboard:
1. Go to "Settings" → "Chatbots"
2. Add this response template:

**Message:**
```
Thank you for your interest in custom colors! 🎨

We can often accommodate special color requests for our products.

Please click here to submit your request:
👉 [Your website]/custom-request.html

We'll review your request and get back to you within 24 hours with:
✓ Color availability
✓ Pricing information  
✓ Estimated delivery time

Need immediate help? Type "agent" to chat with our team!
```

---

## Option 2: Use Custom Request Page Directly

I've created a **custom-request.html** page that:

✅ **Automatically sends emails** to customers when they submit color requests
✅ **Confirms their request** with all details
✅ **Professional response** saying "we'll get back to you in 24 hours"
✅ **Saves requests** to localStorage for your records

### How to Use:

1. **Add link to your site**
   - In navigation menu
   - On product pages
   - In Tidio chatbot responses

2. **Link from Tidio:**
   ```
   Customer: "Do you have this shirt in blue?"
   Bot: "Great question! We may be able to get that color for you.
         Please submit a request here: [link to custom-request.html]
         We'll respond within 24 hours!"
   ```

---

## Option 3: Add Quick Link Buttons to Product Pages

I can add "Request Different Color" buttons on product pages that:
- Link to custom-request.html
- Pre-fill the product name
- Make it easy for customers to request

Would you like me to add these buttons to your product pages?

---

## Email Flow Summary:

When customer submits custom color request:

1. **Customer receives email:**
   ```
   Subject: Custom Color Request - [Product Name]
   
   Dear [Customer Name],
   
   Thank you for your interest! We've received your request for:
   Product: [Product Name]
   Requested Color: [Color]
   
   We'll get back to you within 24 hours with:
   - Color availability
   - Pricing
   - Delivery time
   
   Best regards,
   The Lumo Team
   ```

2. **You receive copy** at the email registered with Web3Forms

3. **Request saved** in localStorage for tracking

---

## Testing:

1. Visit: **your-site.com/custom-request.html**
2. Fill out the form with test data
3. Check your email inbox
4. Customer will receive confirmation immediately

---

## Next Steps:

Choose one:
1. ✅ Use the custom-request.html page (READY NOW)
2. ⚙️ Configure Tidio bot to link to this page
3. 🔘 Add "Request Color" buttons to product pages

Let me know which option you prefer!
