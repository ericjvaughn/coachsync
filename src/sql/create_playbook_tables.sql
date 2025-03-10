-- SQL file for setting up playbook-related tables
-- Part of Phase 2 Database implementation

-- Create playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Disable RLS for MVP development
ALTER TABLE playbooks DISABLE ROW LEVEL SECURITY;

-- Create junction table for playbook-play relationships
CREATE TABLE IF NOT EXISTS playbook_plays (
  playbook_id UUID REFERENCES playbooks(id) ON DELETE CASCADE,
  play_id UUID REFERENCES plays(id) ON DELETE CASCADE,
  order INTEGER,
  PRIMARY KEY (playbook_id, play_id)
);

-- Disable RLS for MVP development
ALTER TABLE playbook_plays DISABLE ROW LEVEL SECURITY;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_playbook_plays_playbook_id ON playbook_plays(playbook_id);
CREATE INDEX IF NOT EXISTS idx_playbook_plays_play_id ON playbook_plays(play_id);

-- Comments for documentation
COMMENT ON TABLE playbooks IS 'Collections of plays organized into playbooks';
COMMENT ON TABLE playbook_plays IS 'Junction table linking plays to playbooks';
