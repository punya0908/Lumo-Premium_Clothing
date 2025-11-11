# Email Setup Guide for Lumo E-commerce

## Quick Setup (5 minutes) - Web3Forms

### Step 1: Get Your Free API Key
1. Visit **https://web3forms.com**
2. Enter your email address (where you want to receive order confirmations)
3. Click "Get Access Key"
4. Check your email and copy the access key

### Step 2: Add Your API Key
1. Open `checkout.js` file
2. Find line with: `access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'`
3. Replace `'YOUR_WEB3FORMS_ACCESS_KEY'` with your actual key
4. Save the file

Example:
```javascript
access_key: 'a1b2c3d4-1234-5678-90ab-cdef12345678'
```

### Step 3: Test It!
1. Add items to cart
2. Go to checkout page
3. Enter a customer email address
4. Click "Confirm Payment"
5. Check both your inbox (Web3Forms email) and the customer's inbox

---

## Alternative Options

### Option 2: EmailJS (More Features)
1. Visit **https://www.emailjs.com**
2. Sign up for free account (300 emails/month)
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Use EmailJS SDK in checkout.js

### Option 3: Supabase Edge Functions (Advanced)
- Use Supabase Edge Functions with Resend API
- Better for production with high volume
- Requires more setup

---

## Current Implementation

The checkout page now:
✅ Validates customer email
✅ Sends order confirmation email
✅ Includes order details, items, and totals
✅ Saves order to localStorage
✅ Tracks conversion in Google Analytics
✅ Shows success modal

---

## Testing Without API Key

If you want to test without getting an API key yet:
- The order will still be saved
- Success modal will still show
- Email just won't be sent
- Check browser console for "Email sent" logs

---

## Need Help?

If Web3Forms doesn't work:
1. Check browser console for errors
2. Verify API key is correct (no extra spaces)
3. Check spam folder for confirmation emails
4. Try EmailJS as alternative
