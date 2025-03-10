-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'created_by') THEN
        ALTER TABLE public.teams ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create teams table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.teams (
    -- Core Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Team Info
    school_name TEXT NOT NULL,
    mascot TEXT,
    level TEXT NOT NULL,
    season TEXT NOT NULL
);

-- Create user_teams junction table
CREATE TABLE IF NOT EXISTS public.user_teams (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, team_id)
);

-- Create updated_at trigger for teams table
CREATE TRIGGER teams_handle_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Temporarily disable RLS on teams until schema is fixed
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- Add RLS policies for teams
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can delete their teams" ON public.teams;

CREATE POLICY "Users can create teams" ON public.teams
    FOR INSERT
    TO authenticated
    WITH CHECK (NEW.created_by = auth.uid());

CREATE POLICY "Users can view their teams" ON public.teams
    FOR SELECT
    TO authenticated
    USING (created_by = auth.uid());

CREATE POLICY "Users can update their teams" ON public.teams
    FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their teams" ON public.teams
    FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());

-- Enable RLS on user_teams
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_teams
DROP POLICY IF EXISTS "Users can manage their team memberships" ON public.user_teams;

CREATE POLICY "Users can manage their team memberships" ON public.user_teams
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid());
