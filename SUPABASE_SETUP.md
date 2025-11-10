# Supabase Integration Guide for Lumo E-Commerce

## 📋 Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase

## 🚀 Setup Instructions

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Click on **API** under Project Settings
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 2: Configure Your Project

1. Open `supabase-config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 3: Set Up Database Tables

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Run this SQL to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  phone TEXT, -- Optional field
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

### Step 4: Configure Authentication Providers (Optional)

#### For Google OAuth:
1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. Follow the instructions to set up Google OAuth credentials

#### For Facebook OAuth:
1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Facebook** provider
3. Follow the instructions to set up Facebook OAuth credentials

### Step 5: Configure Email Settings

1. Go to **Authentication** → **Email Templates**
2. Customize your email templates for:
   - Confirmation emails
   - Password reset emails
   - Magic link emails

### Step 6: Update Your Project Files

**Current Setup:**
- ✅ `supabase-config.js` - Configuration file (update with your credentials)
- ✅ `auth-supabase.js` - Updated authentication logic with Supabase
- ✅ `auth.html` - Updated to include Supabase SDK

**To Use Supabase:**
- The `auth.html` file now loads `auth-supabase.js` instead of `auth.js`
- Update `supabase-config.js` with your project credentials

## 🔐 Features Implemented

### User Authentication
- ✅ **Email/Password Signup** - Creates user in Supabase Auth
- ✅ **Email/Password Login** - Authenticates with Supabase
- ✅ **OAuth Login** - Google & Facebook (requires provider setup)
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Session Management** - Automatic session handling

### User Data Storage
- ✅ **User Profiles** - Stores first name, last name, email, phone
- ✅ **Row Level Security** - Users can only access their own data
- ✅ **Automatic Timestamps** - Created and updated timestamps

## 📱 How It Works

### Signup Flow:
1. User fills signup form
2. Supabase creates auth user
3. Profile created in `profiles` table
4. User data stored in localStorage
5. Redirect to homepage

### Login Flow:
1. User enters credentials
2. Supabase authenticates user
3. Retrieve user profile from `profiles` table
4. Store session in localStorage
5. Redirect to homepage

### Session Management:
1. Supabase automatically manages JWT tokens
2. Session persists across page reloads
3. Check session on protected pages

## 🔧 Testing

### Test Signup:
1. Open `auth.html`
2. Click "Sign Up"
3. Fill in all fields
4. Submit form
5. Check Supabase dashboard → Authentication → Users

### Test Login:
1. Use the email/password you created
2. Login should succeed
3. Check browser console for success message

## 🛡️ Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Secure password hashing by Supabase
- ✅ JWT-based authentication
- ✅ HTTPS enforced

## 📊 Additional Tables (Optional)

You can add more tables for:

### Cart Items:
```sql
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT,
  quantity INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart" 
  ON cart_items 
  USING (auth.uid() = user_id);
```

### Wishlist:
```sql
CREATE TABLE wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" 
  ON wishlist 
  USING (auth.uid() = user_id);
```

### Orders:
```sql
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  order_number TEXT UNIQUE,
  total_amount DECIMAL(10,2),
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid API key"**
   - Check that you copied the correct anon key from Supabase
   - Make sure there are no extra spaces

2. **"Failed to create profile"**
   - Ensure the profiles table exists
   - Check RLS policies are set up correctly

3. **"User already registered"**
   - Email is already in use
   - Try logging in instead

4. **OAuth not working**
   - Make sure you've configured the OAuth provider in Supabase
   - Check redirect URLs are correct

## 📝 Next Steps

1. Update `supabase-config.js` with your credentials
2. Run the SQL to create tables
3. Test signup and login
4. Configure OAuth providers (optional)
5. Add additional features like cart, wishlist, orders

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)

## 📞 Support

For Supabase-specific issues, check:
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Note:** Remember to never commit your `supabase-config.js` file with real credentials to a public repository. Use environment variables in production.
