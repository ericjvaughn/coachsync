import { supabase } from './supabase'

async function testSupabase() {
  // Test unauthenticated access (should fail due to RLS)
  console.log('Testing unauthenticated access...')
  const { data: formationsData, error: formationsError } = await supabase
    .from('formations')
    .select('*')
    .limit(1)
  
  if (formationsError) {
    console.log('✓ RLS working - unauthenticated access blocked:', formationsError.message)
  } else {
    console.log('⚠ WARNING: Unauthenticated access allowed!')
    console.log(formationsData)
  }

  // Test authenticated access
  console.log('\nTesting authenticated access...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'test123'
  })

  if (authError) {
    console.log('✗ Auth failed:', authError.message)
    return
  }

  console.log('✓ Auth successful')

  // Test RLS with authenticated user
  const { data: authedFormations, error: authedError } = await supabase
    .from('formations')
    .select('*')
    .limit(1)

  if (authedError) {
    console.log('✗ Authenticated access failed:', authedError.message)
  } else {
    console.log('✓ Authenticated access successful')
    console.log(authedFormations)
  }
}

testSupabase().catch(console.error)
