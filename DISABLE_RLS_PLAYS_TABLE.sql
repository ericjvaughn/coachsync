-- EMERGENCY MVP DEVELOPMENT SOLUTION
-- WARNING: THIS DISABLES ALL SECURITY ON THE PLAYS TABLE
-- FOR DEVELOPMENT PURPOSES ONLY

-- Step 1: Disable RLS on plays table completely
ALTER TABLE plays DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'plays';

-- Step 3: Drop any existing RLS policies on the plays table (optional cleanup)
DROP POLICY IF EXISTS "Enable read access for all users" ON plays;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON plays;
DROP POLICY IF EXISTS "Enable update for users based on id" ON plays;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON plays;

-- NOTE: To re-enable RLS later, run:
-- ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
-- Then recreate appropriate policies
