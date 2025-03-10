-- Drop existing policies
DROP POLICY IF EXISTS "Users can create formations" ON public.formations;
DROP POLICY IF EXISTS "Users can view their own formations" ON public.formations;
DROP POLICY IF EXISTS "Users can update their own formations" ON public.formations;
DROP POLICY IF EXISTS "Users can delete their own formations" ON public.formations;

-- Create team-based policies
CREATE POLICY "Users can create formations for their teams" ON public.formations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = NEW.team_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view formations for their teams" ON public.formations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = team_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update formations for their teams" ON public.formations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = team_id
            AND created_by = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = NEW.team_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete formations for their teams" ON public.formations
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE id = team_id
            AND created_by = auth.uid()
        )
    );
