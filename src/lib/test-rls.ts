import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRLS() {
  console.log('Testing RLS policies...\n')

  // Test 1: Unauthenticated INSERT
  console.log('Test 1: Unauthenticated INSERT')
  const { error: insertError } = await supabase
    .from('formations')
    .insert({
      name: 'Test Formation',
      type: 'offense',
      player_positions: { players: [] },
      created_by: '00000000-0000-0000-0000-000000000000'
    })
  
  if (insertError) {
    console.log('✓ INSERT blocked:', insertError.message)
  } else {
    console.log('⚠ INSERT allowed without auth!')
  }

  // Test 2: Unauthenticated SELECT with explicit WHERE
  console.log('\nTest 2: Unauthenticated SELECT')
  const { error: selectError } = await supabase
    .from('formations')
    .select('*')
    .eq('created_by', '00000000-0000-0000-0000-000000000000')
  
  if (selectError) {
    console.log('✓ SELECT blocked:', selectError.message)
  } else {
    console.log('⚠ SELECT allowed without auth!')
  }

  // Test 3: Unauthenticated UPDATE
  console.log('\nTest 3: Unauthenticated UPDATE')
  const { error: updateError } = await supabase
    .from('formations')
    .update({ name: 'Updated Formation' })
    .eq('created_by', '00000000-0000-0000-0000-000000000000')
  
  if (updateError) {
    console.log('✓ UPDATE blocked:', updateError.message)
  } else {
    console.log('⚠ UPDATE allowed without auth!')
  }

  // Test 4: Unauthenticated DELETE
  console.log('\nTest 4: Unauthenticated DELETE')
  const { error: deleteError } = await supabase
    .from('formations')
    .delete()
    .eq('created_by', '00000000-0000-0000-0000-000000000000')
  
  if (deleteError) {
    console.log('✓ DELETE blocked:', deleteError.message)
  } else {
    console.log('⚠ DELETE allowed without auth!')
  }

  // Test 5: Same tests for plays table
  console.log('\nTesting plays table...')
  const { error: playsError } = await supabase
    .from('plays')
    .select('*')
    .eq('created_by', '00000000-0000-0000-0000-000000000000')
  
  if (playsError) {
    console.log('✓ Plays table protected:', playsError.message)
  } else {
    console.log('⚠ Plays table accessible without auth!')
  }
}

testRLS().catch(console.error)
