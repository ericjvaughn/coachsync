import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface FormationState {
  // State
  name: string
  isSaving: boolean
  error: string | null
  
  // Actions
  setName: (name: string) => void
  saveFormation: (players: any[]) => Promise<void>
  clearError: () => void
}

export const useFormationState = create<FormationState>((set, get) => ({
  // Initial state
  name: '',
  isSaving: false,
  error: null,
  
  // Actions
  setName: (name) => set({ name }),
  
  clearError: () => set({ error: null }),
  
  saveFormation: async (players) => {
    const state = get()
    if (!state.name) {
      set({ error: 'Formation name is required' })
      return
    }

    set({ isSaving: true, error: null })

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Save formation to Supabase
      const { error } = await supabase
        .from('formations')
        .insert({
          name: state.name,
          type: players.some(p => p.type === 'defense') ? 'defense' : 'offense',
          player_positions: { players },
          created_by: user.id
        })

      if (error) throw error

      // Reset state after successful save
      set({ 
        name: '',
        isSaving: false,
        error: null
      })
    } catch (error) {
      set({ 
        isSaving: false,
        error: error.message
      })
    }
  }
}))
