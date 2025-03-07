import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY')
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
    if (error) throw error
    console.log('Supabase connection successful!')
    return true
  } catch (error) {
    console.log('Supabase connection test:', error.message)
    return false
  }
}
