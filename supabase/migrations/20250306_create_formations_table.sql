-- Create enum for formation types
CREATE TYPE formation_type AS ENUM ('offense', 'defense');

-- Create formations table
CREATE TABLE IF NOT EXISTS public.formations (
    -- Core Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type formation_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_default BOOLEAN DEFAULT false NOT NULL,
    
    -- Formation Data
    player_positions JSONB NOT NULL,
    personnel_package TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Defense-Specific Fields
    coverage TEXT,
    blitz BOOLEAN,
    
    -- Visual Assets
    thumbnail_url TEXT,

    -- Validation constraints
    CONSTRAINT valid_player_positions CHECK (jsonb_typeof(player_positions->'players') = 'array'),
    CONSTRAINT valid_defense_fields CHECK (
        (type = 'defense' AND coverage IS NOT NULL AND blitz IS NOT NULL) OR
        (type = 'offense' AND coverage IS NULL AND blitz IS NULL)
    )
);

-- Create index for team_id for faster lookups
CREATE INDEX formations_team_id_idx ON public.formations(team_id);

-- Create index for created_by for faster lookups
CREATE INDEX formations_created_by_idx ON public.formations(created_by);

-- Create index for type for filtering
CREATE INDEX formations_type_idx ON public.formations(type);

-- Create trigger for updated_at
CREATE TRIGGER formations_handle_updated_at
    BEFORE UPDATE ON public.formations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
