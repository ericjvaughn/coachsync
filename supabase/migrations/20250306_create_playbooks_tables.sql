-- Create playbooks table
CREATE TABLE IF NOT EXISTS public.playbooks (
    -- Core Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Organization
    description TEXT,
    type formation_type NOT NULL,
    season TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Visual Assets
    thumbnail_url TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_template BOOLEAN DEFAULT false NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL
);

-- Create playbook_plays junction table
CREATE TABLE IF NOT EXISTS public.playbook_plays (
    playbook_id UUID REFERENCES public.playbooks(id) ON DELETE CASCADE,
    play_id UUID REFERENCES public.plays(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    order_index INTEGER NOT NULL,
    section TEXT,
    notes TEXT,
    PRIMARY KEY (playbook_id, play_id)
);

-- Create indexes for common lookups
CREATE INDEX playbooks_team_id_idx ON public.playbooks(team_id);
CREATE INDEX playbooks_created_by_idx ON public.playbooks(created_by);
CREATE INDEX playbooks_type_idx ON public.playbooks(type);
CREATE INDEX playbook_plays_playbook_id_idx ON public.playbook_plays(playbook_id);
CREATE INDEX playbook_plays_play_id_idx ON public.playbook_plays(play_id);
CREATE INDEX playbook_plays_order_idx ON public.playbook_plays(playbook_id, order_index);

-- Create trigger for updated_at
CREATE TRIGGER playbooks_handle_updated_at
    BEFORE UPDATE ON public.playbooks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_plays ENABLE ROW LEVEL SECURITY;
