-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'created_by') THEN
        ALTER TABLE public.teams ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update RLS policies to be more permissive temporarily
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can delete their teams" ON public.teams;

CREATE POLICY "Users can create teams" ON public.teams
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their teams" ON public.teams
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their teams" ON public.teams
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their teams" ON public.teams
    FOR DELETE
    TO authenticated
    USING (true);
