import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment
let supabaseUrl: string = ''
let supabaseAnonKey: string = ''

// Check if we're in a browser environment (Vite/import.meta available)
if (typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
} else {
  // We're in Node.js
  supabaseUrl = process.env.VITE_SUPABASE_URL || ''
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
}

// Log warning instead of throwing error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key - authentication will not work')
}

// Create Supabase client with appropriate storage
const storage = typeof window !== 'undefined' ? window.localStorage : undefined

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Initialize auth state
if (typeof window !== 'undefined') {
  supabase.auth.startAutoRefresh()
}

// Wait for auth to be ready with timeout
export const waitForAuth = (timeoutMs = 5000) => {
  return new Promise((resolve) => {
    // First check if we already have a session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        console.log('Found existing session')
        resolve(data.session)
        return
      }
      
      // If no session, listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', { 
          event, 
          userId: session?.user?.id,
          email: session?.user?.email
        })
        
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          subscription.unsubscribe()
          resolve(session)
        }
      })
      
      // Set timeout to resolve after some time even without auth
      setTimeout(() => {
        console.log('Auth wait timeout reached')
        resolve(null)
      }, timeoutMs)
    })
  })
}

// Check connection and basic auth functionality
export const checkAuth = async () => {
  try {
    // Simple ping to Supabase to check connection
    const { error } = await supabase.from('_pgrst_reserved_dummy').select('*').limit(1)
    
    // If error is 'relation does not exist', that's actually good - it means we connected
    // If error includes 'fetch failed' or similar, we have connectivity issues
    const isConnected = error?.message?.includes('relation') || !error
    
    if (!isConnected) {
      console.error('Supabase connection failed:', error?.message)
      return { connected: false, authenticated: false, message: 'Connection failed' }
    }
    
    // Check if we're authenticated
    const { data } = await supabase.auth.getSession()
    const isAuthenticated = !!data.session
    
    if (isAuthenticated) {
      console.log('Authenticated as:', data.session.user.email)
      return { connected: true, authenticated: true, userId: data.session.user.id }
    } else {
      console.log('Connected but not authenticated')
      return { connected: true, authenticated: false, message: 'Not authenticated' }
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return { connected: false, authenticated: false, message: error.message }
  }
}
