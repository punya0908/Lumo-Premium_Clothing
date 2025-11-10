// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://xsowlliqhijmxszligou.supabase.co"; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzb3dsbGlxaGlqbXhzemxpZ291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODA0NzIsImV4cCI6MjA3ODM1NjQ3Mn0.D_5aqBxu7bUU0uE_1K2iQ71SZ2m1MvE1VWgi2li_a5Q"; // Your project's anon/public key

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
