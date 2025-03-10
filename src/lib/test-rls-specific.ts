import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSpecificRLS() {
  console.log('Testing specific RLS scenarios...\n')

  // Test 1: Try to read with explicit public role
  console.log('Test 1: Public role SELECT')
  const { data: publicData, error: publicError } = await supabase
    .from('formations')
    .select('*')
    .limit(1)
  
  console.log('Result:', publicData ? `Found ${publicData.length} rows` : 'No data')
  console.log('Error:', publicError ? publicError.message : 'No error')

  // Test 2: Try to read with auth.role() check
  console.log('\nTest 2: Role-based SELECT')
  const { data: roleData, error: roleError } = await supabase
    .rpc('check_auth_role')
    .select('*')
  
  console.log('Result:', roleData ? `Found ${roleData.length} rows` : 'No data')
  console.log('Error:', roleError ? roleError.message : 'No error')

  // Test 3: Try to modify without auth
  console.log('\nTest 3: Unauthenticated modification')
  const { error: modifyError } = await supabase
    .from('formations')
    .insert({
      name: 'Test Formation',
      type: 'offense',
      player_positions: { players: [] }
    })
  
  console.log('Error:', modifyError ? modifyError.message : 'No error')

  // Test 4: Try to bypass RLS with direct conditions
  console.log('\nTest 4: RLS bypass attempt')
  const { data: bypassData, error: bypassError } = await supabase
    .from('formations')
    .select('*')
    .or('1.eq.1')
    .limit(1)
  
  console.log('Result:', bypassData ? `Found ${bypassData.length} rows` : 'No data')
  console.log('Error:', bypassError ? bypassError.message : 'No error')
}

testSpecificRLS().catch(console.error)
