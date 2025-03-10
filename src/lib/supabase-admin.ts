import { createClient } from '@supabase/supabase-js'

// WARNING: This client bypasses RLS policies
// FOR MVP DEVELOPMENT ONLY - Not for production use

// IMPORTANT: This is a DEVELOPMENT ONLY solution for MVP testing
// Using hard-coded values for direct testing of core functionality
// This is NOT appropriate for production use

// Direct URL from .env file - we know this works with the regular client
const supabaseUrl = 'https://ybvrtnbdrqwvcmmsnfjd.supabase.co'

// For MVP testing - directly using the anon key temporarily
// This won't bypass RLS but will help us test functionality
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('DEVELOPMENT ONLY: Using anon key for MVP testing')

// Create admin client with service role key - this bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// For development safety - warning if accidentally used in production
if (import.meta.env.MODE === 'production') {
  console.error('⚠️ WARNING: supabaseAdmin client should not be used in production!')
}
