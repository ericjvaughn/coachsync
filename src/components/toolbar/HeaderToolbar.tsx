import React, { useState } from 'react'
import { useToolState } from '../../store/toolState'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export function HeaderToolbar() {
  const [formationName, setFormationName] = useState('')
  const [playName, setPlayName] = useState('')
  const [defense, setDefense] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { history, currentIndex } = useToolState()

  const isValid = formationName.trim() && playName.trim()

  const handleSave = async () => {
    if (!isValid) return
    setIsSaving(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Extract players from history
      const players = history
        .slice(0, currentIndex + 1)
        .filter(action => 
          action.type === 'PLAYER_ADD' || 
          action.type === 'PLAYER_MOVE'
        )
        .reduce((acc: any[], action) => {
          if (action.type === 'PLAYER_ADD') {
            return [...acc, action.payload]
          }
          // Handle player moves
          return acc.map(player => 
            player.id === action.payload.id ? action.payload : player
          )
        }, [])

      // Determine formation type
      const type = players.some(p => p.type === 'defense') ? 'defense' : 'offense'

      // Save formation
      const { data: formation, error: formationError } = await supabase
        .from('formations')
        .insert({
          name: formationName,
          type,
          player_positions: { players },
          created_by: user.id
        })
        .select()
        .single()

      if (formationError) throw formationError

      // Save play
      const { error: playError } = await supabase
        .from('plays')
        .insert({
          name: playName,
          type,
          formation_id: formation.id,
          player_positions: { players },
          routes: { routes: [] }, // We'll handle routes in a future task
          created_by: user.id,
          defense: defense || null
        })

      if (playError) throw playError

      // Reset form
      setFormationName('')
      setPlayName('')
      setDefense('')
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-6">
      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
        New Play
      </button>
      <div className="flex items-center space-x-4 relative">
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={formationName}
              onChange={(e) => setFormationName(e.target.value)}
              placeholder="Formation Name"
              className="w-36 px-3 py-2 text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={playName}
              onChange={(e) => setPlayName(e.target.value)}
              placeholder="Play Name"
              className="w-36 px-3 py-2 text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              placeholder="Defense"
              className="w-36 px-3 py-2 text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Play'}
        </button>

        {error && (
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-xs text-red-500">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
