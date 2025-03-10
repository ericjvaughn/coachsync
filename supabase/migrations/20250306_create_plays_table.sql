-- Create plays table
CREATE TABLE IF NOT EXISTS public.plays (
    -- Core Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    formation_id UUID REFERENCES public.formations(id) ON DELETE RESTRICT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type formation_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Play Data
    player_positions JSONB NOT NULL,
    routes JSONB NOT NULL,
    notes TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    situation TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Visual Assets
    thumbnail_url TEXT,
    
    -- Metadata
    personnel_package TEXT,
    is_favorite BOOLEAN DEFAULT false NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    
    -- Defense-Specific Fields
    coverage TEXT,
    blitz BOOLEAN,
    
    -- Validation constraints
    CONSTRAINT valid_player_positions CHECK (jsonb_typeof(player_positions->'players') = 'array'),
    CONSTRAINT valid_routes CHECK (jsonb_typeof(routes->'routes') = 'array'),
    CONSTRAINT valid_defense_fields CHECK (
        (type = 'defense' AND coverage IS NOT NULL AND blitz IS NOT NULL) OR
        (type = 'offense' AND coverage IS NULL AND blitz IS NULL)
    )
);

-- Create indexes for common lookups
CREATE INDEX plays_team_id_idx ON public.plays(team_id);
CREATE INDEX plays_formation_id_idx ON public.plays(formation_id);
CREATE INDEX plays_created_by_idx ON public.plays(created_by);
CREATE INDEX plays_type_idx ON public.plays(type);

-- Create trigger for updated_at
CREATE TRIGGER plays_handle_updated_at
    BEFORE UPDATE ON public.plays
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- First, enable RLS and remove any existing policies
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create plays" ON public.plays;
DROP POLICY IF EXISTS "Users can view their own plays" ON public.plays;
DROP POLICY IF EXISTS "Users can update their own plays" ON public.plays;
DROP POLICY IF EXISTS "Users can delete their own plays" ON public.plays;

-- Then create specific allow policies
CREATE POLICY "Users can create plays" ON public.plays
    FOR INSERT
    TO authenticated
    WITH CHECK (NEW.created_by = auth.uid());

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
