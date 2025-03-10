-- Add RLS policies for formations table
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

-- Add RLS policies for plays table
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
