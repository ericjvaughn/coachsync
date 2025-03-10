import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase, checkAuth } from './lib/supabase'
import './index.css'
import App from './App.tsx'

// Make sure Supabase is initialized
const initializeApp = async () => {
  console.log('Initializing Supabase authentication...')
  
  try {
    // Ensure environment variables are loaded
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables. Please check .env.local file.')
      console.log('Available env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')))
    } else {
      console.log('Supabase environment variables found')
    }
    
    // Start the auto refresh process explicitly
    supabase.auth.startAutoRefresh()
    
    // Check Supabase connection and auth status
    const authStatus = await checkAuth()
    console.log('Supabase status:', authStatus)
    
    if (!authStatus.connected) {
      console.error('Unable to connect to Supabase. Check network and configuration.')
    } else if (!authStatus.authenticated) {
      console.log('Connected to Supabase but not authenticated. Login will be required.')
    } else {
      console.log('Successfully connected and authenticated with Supabase.')
    }
    
    // Render the app regardless of connection status to show appropriate UI
    renderApp()
  } catch (error) {
    console.error('Failed to initialize Supabase:', error)
    renderApp() // Render anyway to show auth UI
  }
}

// Function to render the app
const renderApp = () => {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Failed to find root element')
  
  createRoot(rootElement).render(
    <StrictMode>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={null} // Allow explicit loading state
      >
        <App />
      </SessionContextProvider>
    </StrictMode>,
  )
}

// Start initialization
initializeApp()
