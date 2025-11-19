// Supabase Configuration
// IMPORTANT: Replace the placeholders below with your project's values.
// Do NOT commit real keys to source control. For production, load these
// values from environment variables or a secure secrets store.
const SUPABASE_URL = "REPLACE_WITH_YOUR_SUPABASE_URL"; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "REPLACE_WITH_YOUR_SUPABASE_ANON_KEY"; // Your project's anon/public key

// Wait for supabase library to load, then initialize
if (typeof window.supabase !== 'undefined') {
    // Initialize Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Export for use in other files
    window.supabaseClient = supabase;
    
    console.log('Supabase initialized successfully');
} else {
    console.error('Supabase library not loaded yet');
}
