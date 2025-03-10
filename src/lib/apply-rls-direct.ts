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

  const sql = `
    -- Drop existing policies for formations
    DROP POLICY IF EXISTS "Users can create formations" ON public.formations;
    DROP POLICY IF EXISTS "Users can view their own formations" ON public.formations;
    DROP POLICY IF EXISTS "Users can update their own formations" ON public.formations;
    DROP POLICY IF EXISTS "Users can delete their own formations" ON public.formations;
    DROP POLICY IF EXISTS "Deny public access" ON public.formations;

    -- Create new policies for formations
    CREATE POLICY "Deny public access" ON public.formations
        FOR ALL
        TO public
        USING (false);

    CREATE POLICY "Users can create formations" ON public.formations
        FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Users can view their own formations" ON public.formations
        FOR SELECT
        TO authenticated
        USING (created_by = auth.uid());

    CREATE POLICY "Users can update their own formations" ON public.formations
        FOR UPDATE
        TO authenticated
        USING (created_by = auth.uid())
        WITH CHECK (created_by = auth.uid());

    CREATE POLICY "Users can delete their own formations" ON public.formations
        FOR DELETE
        TO authenticated
        USING (created_by = auth.uid());

    -- Drop existing policies for plays
    DROP POLICY IF EXISTS "Users can create plays" ON public.plays;
    DROP POLICY IF EXISTS "Users can view their own plays" ON public.plays;
    DROP POLICY IF EXISTS "Users can update their own plays" ON public.plays;
    DROP POLICY IF EXISTS "Users can delete their own plays" ON public.plays;
    DROP POLICY IF EXISTS "Deny public access" ON public.plays;

    -- Create new policies for plays
    CREATE POLICY "Deny public access" ON public.plays
        FOR ALL
        TO public
        USING (false);

    CREATE POLICY "Users can create plays" ON public.plays
        FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Users can view their own plays" ON public.plays
        FOR SELECT
        TO authenticated
        USING (created_by = auth.uid());

    CREATE POLICY "Users can update their own plays" ON public.plays
        FOR UPDATE
        TO authenticated
        USING (created_by = auth.uid())
        WITH CHECK (created_by = auth.uid());

    CREATE POLICY "Users can delete their own plays" ON public.plays
        FOR DELETE
        TO authenticated
        USING (created_by = auth.uid());
  `

  try {
    const { error } = await supabase.rpc('exec_sql', { sql })
    if (error) throw error
    console.log('✓ RLS policies applied successfully')
  } catch (error) {
    console.error('Error applying RLS policies:', error)
  }
}

applyRLSPolicies()
