-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    -- Core Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
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

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_teams
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;
