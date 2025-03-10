import { create } from 'zustand'
import { supabase } from '../lib/supabase'

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
      // Get current user and log details for debugging
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      // Log auth details to console for debugging
      console.log('Auth Debug:', { 
        user: user ? { id: user.id, email: user.email } : null,
        authError
      })
      
      if (!user) throw new Error('Not authenticated')

      // Skip team lookup - we're making formations work without requiring a team
      console.log('Skipping team lookup - formations will work independently')

      // Prepare formation data without team_id
      const formationData = {
        name: state.name,
        type: 'offense', // Start with offense formations first
        player_positions: { players },
        created_by: user.id,
        team_id: null,   // Setting to null since we're not requiring teams
        coverage: null,  // Required by schema for offense
        blitz: null      // Required by schema for offense
      }
      
      // Log the formation data we're trying to insert
      console.log('Formation Insert Debug:', { 
        formationData,
        userId: user.id,
        teamId: null // No team dependency
      })
      
      // Save formation to Supabase - wrap in try/catch for detailed error logging
      console.log('Attempting to save formation directly...')
      
      // Execute the insert and capture the result
      const saveResult = await supabase
        .from('formations')
        .insert(formationData)
        .select()
      
      // Destructure the result
      const { error, data } = saveResult
        
      // Check for RLS policy errors specifically
      if (error?.message?.includes('policy')) {
        console.error('RLS Policy Error:', error.message)
        throw new Error(`Permission error: ${error.message}\nPossible solution: Admin needs to update RLS policies for formations table.`)
      }
      
      // Log insert results
      console.log('Insert Result:', { 
        success: !error,
        error: error ? { 
          message: error.message, 
          code: error.code, 
          details: error.details 
        } : null,
        data: data
      })

      if (error) throw error

      // Confirm success in console
      console.log('Formation saved successfully!')
      
      // Reset state after successful save
      set({ 
        name: '',
        isSaving: false,
        error: null
      })
    } catch (error) {
      // Log the complete error with more details
      console.error('Formation Save Error:', { 
        message: error.message,
        stack: error.stack,
        details: error,
        errorType: error.constructor.name
      })
      
      // Show a more user-friendly error message
      let errorMessage = error.message
      
      // Handle specific error types
      if (errorMessage.includes('policy')) {
        errorMessage = 'You do not have permission to save this formation. Please contact an administrator.'
      } else if (errorMessage.includes('duplicate')) {
        errorMessage = 'A formation with this name already exists. Please choose another name.'
      }
      
      set({ 
        isSaving: false,
        error: errorMessage
      })
    }
  }
}))
