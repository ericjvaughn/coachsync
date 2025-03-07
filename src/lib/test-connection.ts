import { testConnection } from './supabase'

console.log('Testing Supabase connection...')
testConnection().then((success) => {
  if (!success) {
    console.error('Failed to connect to Supabase')
    process.exit(1)
  }
  console.log('Connection test complete')
})
