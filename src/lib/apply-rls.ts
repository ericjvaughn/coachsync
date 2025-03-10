import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRole = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Missing Supabase URL or service role key')
}

// Create admin client with service role
const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function applyRLSPolicies() {
  console.log('Applying RLS policies...')

  try {
    // Drop existing policies for formations
    await supabase.rpc('drop_policy', { table_name: 'formations', policy_name: 'Users can create formations' })
    await supabase.rpc('drop_policy', { table_name: 'formations', policy_name: 'Users can view their own formations' })
    await supabase.rpc('drop_policy', { table_name: 'formations', policy_name: 'Users can update their own formations' })
    await supabase.rpc('drop_policy', { table_name: 'formations', policy_name: 'Users can delete their own formations' })

    // Create new policies for formations
    await supabase.rpc('create_policy', {
      table_name: 'formations',
      policy_name: 'Deny public access',
      definition: 'FOR ALL TO public USING (false)'
    })

    await supabase.rpc('create_policy', {
      table_name: 'formations',
      policy_name: 'Users can create formations',
      definition: 'FOR INSERT TO authenticated WITH CHECK (true)'
    })

    await supabase.rpc('create_policy', {
      table_name: 'formations',
      policy_name: 'Users can view their own formations',
      definition: 'FOR SELECT TO authenticated USING (created_by = auth.uid())'
    })

    await supabase.rpc('create_policy', {
      table_name: 'formations',
      policy_name: 'Users can update their own formations',
      definition: 'FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())'
    })

    await supabase.rpc('create_policy', {
      table_name: 'formations',
      policy_name: 'Users can delete their own formations',
      definition: 'FOR DELETE TO authenticated USING (created_by = auth.uid())'
    })

    // Drop existing policies for plays
    await supabase.rpc('drop_policy', { table_name: 'plays', policy_name: 'Users can create plays' })
    await supabase.rpc('drop_policy', { table_name: 'plays', policy_name: 'Users can view their own plays' })
    await supabase.rpc('drop_policy', { table_name: 'plays', policy_name: 'Users can update their own plays' })
    await supabase.rpc('drop_policy', { table_name: 'plays', policy_name: 'Users can delete their own plays' })

    // Create new policies for plays
    await supabase.rpc('create_policy', {
      table_name: 'plays',
      policy_name: 'Deny public access',
      definition: 'FOR ALL TO public USING (false)'
    })

    await supabase.rpc('create_policy', {
      table_name: 'plays',
      policy_name: 'Users can create plays',
      definition: 'FOR INSERT TO authenticated WITH CHECK (true)'
    })

    await supabase.rpc('create_policy', {
      table_name: 'plays',
      policy_name: 'Users can view their own plays',
      definition: 'FOR SELECT TO authenticated USING (created_by = auth.uid())'
    })

    await supabase.rpc('create_policy', {
      table_name: 'plays',
      policy_name: 'Users can update their own plays',
      definition: 'FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())'
    })

    await supabase.rpc('create_policy', {
      table_name: 'plays',
      policy_name: 'Users can delete their own plays',
      definition: 'FOR DELETE TO authenticated USING (created_by = auth.uid())'
    })

    console.log('✓ RLS policies applied successfully')
  } catch (error) {
    console.error('Error applying RLS policies:', error)
  }
}

applyRLSPolicies()
