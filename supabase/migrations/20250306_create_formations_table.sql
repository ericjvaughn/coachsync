-- Drop any existing formations table and related objects
DROP TABLE IF EXISTS public.formations CASCADE;

-- Create formations table
CREATE TABLE public.formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    player_positions JSONB NOT NULL,
    CONSTRAINT valid_player_positions CHECK (jsonb_typeof(player_positions->'players') = 'array')
);

-- Create index for team_id for faster lookups
CREATE INDEX formations_team_id_idx ON public.formations(team_id);

-- Enable RLS
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- Single policy for all operations
CREATE POLICY "Team owners manage formations" ON public.formations
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = team_id
            AND created_by = auth.uid()
        )
    );
