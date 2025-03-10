import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabase-admin' // Admin client for MVP testing only

// Define interfaces for our playbook types
export interface Playbook {
  id?: string
  name: string
  description?: string
  type: string // Required field based on database schema
  created_at?: string
  // We won't store plays directly in the playbook object
  // Instead, we'll query plays with playbook_id when needed
}

export interface PlaybookPlay {
  playbook_id: string
  play_id: string
  order?: number // Optional ordering within playbook
}

interface PlaybookState {
  // State
  playbooks: Playbook[]
  currentPlaybook: Playbook | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  
  // Actions
  createPlaybook: (playbook: Playbook) => Promise<string | null>
  updatePlaybook: (playbook: Playbook) => Promise<boolean>
  deletePlaybook: (id: string) => Promise<boolean>
  fetchPlaybooks: () => Promise<void>
  setCurrentPlaybook: (playbook: Playbook | null) => void
  addPlayToPlaybook: (playbookId: string, playId: string, order?: number) => Promise<boolean>
  removePlayFromPlaybook: (playbookId: string, playId: string) => Promise<boolean>
  getPlaysInPlaybook: (playbookId: string) => Promise<any[]>
  clearError: () => void
}

export const usePlaybookState = create<PlaybookState>((set, get) => ({
  // Initial state
  playbooks: [],
  currentPlaybook: null,
  isLoading: false,
  isSaving: false,
  error: null,
  
  // Actions
  clearError: () => set({ error: null }),
  
  setCurrentPlaybook: (playbook) => set({ currentPlaybook: playbook }),
  
  createPlaybook: async (playbook) => {
    set({ isSaving: true, error: null })
    
    try {
      console.log('Creating new playbook:', playbook)
      
      // For MVP development, use admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('playbooks')
        .insert(playbook)
        .select()
      
      if (error) {
        console.error('Error creating playbook:', error)
        set({ error: `Failed to create playbook: ${error.message}`, isSaving: false })
        return null
      }
      
      // Add the new playbook to our local state
      const newPlaybook = data[0]
      set((state) => ({ 
        playbooks: [...state.playbooks, newPlaybook],
        isSaving: false
      }))
      
      console.log('Playbook created successfully:', newPlaybook)
      return newPlaybook.id
    } catch (err: any) {
      console.error('Unexpected error creating playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isSaving: false })
      return null
    }
  },
  
  updatePlaybook: async (playbook) => {
    if (!playbook.id) {
      set({ error: 'Cannot update playbook without ID' })
      return false
    }
    
    set({ isSaving: true, error: null })
    
    try {
      const { error } = await supabaseAdmin
        .from('playbooks')
        .update(playbook)
        .eq('id', playbook.id)
      
      if (error) {
        console.error('Error updating playbook:', error)
        set({ error: `Failed to update playbook: ${error.message}`, isSaving: false })
        return false
      }
      
      // Update our local state
      set((state) => ({
        playbooks: state.playbooks.map(p => 
          p.id === playbook.id ? { ...p, ...playbook } : p
        ),
        currentPlaybook: playbook.id === state.currentPlaybook?.id 
          ? { ...state.currentPlaybook, ...playbook } 
          : state.currentPlaybook,
        isSaving: false
      }))
      
      return true
    } catch (err: any) {
      console.error('Unexpected error updating playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isSaving: false })
      return false
    }
  },
  
  deletePlaybook: async (id) => {
    set({ isSaving: true, error: null })
    
    try {
      // First, remove any plays associated with this playbook
      const { error: playsError } = await supabaseAdmin
        .from('playbook_plays')
        .delete()
        .eq('playbook_id', id)
      
      if (playsError) {
        console.error('Error removing plays from playbook:', playsError)
        set({ error: `Failed to delete playbook: ${playsError.message}`, isSaving: false })
        return false
      }
      
      // Now delete the playbook itself
      const { error } = await supabaseAdmin
        .from('playbooks')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting playbook:', error)
        set({ error: `Failed to delete playbook: ${error.message}`, isSaving: false })
        return false
      }
      
      // Update our local state
      set((state) => ({
        playbooks: state.playbooks.filter(p => p.id !== id),
        currentPlaybook: state.currentPlaybook?.id === id ? null : state.currentPlaybook,
        isSaving: false
      }))
      
      return true
    } catch (err: any) {
      console.error('Unexpected error deleting playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isSaving: false })
      return false
    }
  },
  
  fetchPlaybooks: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching playbooks:', error)
        set({ error: `Failed to fetch playbooks: ${error.message}`, isLoading: false })
        return
      }
      
      set({ playbooks: data || [], isLoading: false })
      console.log('Fetched playbooks:', data)
    } catch (err: any) {
      console.error('Unexpected error fetching playbooks:', err)
      set({ error: `Unexpected error: ${err.message}`, isLoading: false })
    }
  },
  
  addPlayToPlaybook: async (playbookId, playId, order) => {
    set({ isSaving: true, error: null })
    
    try {
      // Create the playbook-play relationship
      const playbookPlay: PlaybookPlay = {
        playbook_id: playbookId,
        play_id: playId,
        order: order || undefined
      }
      
      const { error } = await supabaseAdmin
        .from('playbook_plays')
        .insert(playbookPlay)
      
      if (error) {
        console.error('Error adding play to playbook:', error)
        set({ error: `Failed to add play to playbook: ${error.message}`, isSaving: false })
        return false
      }
      
      set({ isSaving: false })
      return true
    } catch (err: any) {
      console.error('Unexpected error adding play to playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isSaving: false })
      return false
    }
  },
  
  removePlayFromPlaybook: async (playbookId, playId) => {
    set({ isSaving: true, error: null })
    
    try {
      const { error } = await supabaseAdmin
        .from('playbook_plays')
        .delete()
        .match({ playbook_id: playbookId, play_id: playId })
      
      if (error) {
        console.error('Error removing play from playbook:', error)
        set({ error: `Failed to remove play from playbook: ${error.message}`, isSaving: false })
        return false
      }
      
      set({ isSaving: false })
      return true
    } catch (err: any) {
      console.error('Unexpected error removing play from playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isSaving: false })
      return false
    }
  },
  
  getPlaysInPlaybook: async (playbookId) => {
    set({ isLoading: true, error: null })
    
    try {
      // Query the plays through the junction table
      const { data, error } = await supabase
        .from('playbook_plays')
        .select(`
          play_id,
          order,
          plays (*)
        `)
        .eq('playbook_id', playbookId)
        .order('order')
      
      if (error) {
        console.error('Error fetching plays in playbook:', error)
        set({ error: `Failed to fetch plays: ${error.message}`, isLoading: false })
        return []
      }
      
      set({ isLoading: false })
      
      // Transform the data to a more usable format
      const plays = data?.map(item => ({
        ...item.plays,
        order: item.order
      })) || []
      
      console.log('Fetched plays in playbook:', plays)
      return plays
    } catch (err: any) {
      console.error('Unexpected error fetching plays in playbook:', err)
      set({ error: `Unexpected error: ${err.message}`, isLoading: false })
      return []
    }
  }
}))
