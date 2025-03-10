import React, { useState, useEffect } from 'react'
import { usePlaybookState } from '../../store/playbookState'
import { supabase } from '../../lib/supabase'

// Component for managing plays within a specific playbook
const PlaybookPlayManager: React.FC<{ playbookId: string }> = ({ playbookId }) => {
  const { 
    addPlayToPlaybook,
    removePlayFromPlaybook,
    getPlaysInPlaybook,
    error
  } = usePlaybookState()
  
  const [playbookPlays, setPlaybookPlays] = useState<any[]>([])
  const [availablePlays, setAvailablePlays] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlayId, setSelectedPlayId] = useState('')
  
  // Load data on component mount or playbookId change
  useEffect(() => {
    if (playbookId) {
      loadPlaybookPlays()
      loadAvailablePlays()
    }
  }, [playbookId])
  
  // Load plays already in the playbook
  const loadPlaybookPlays = async () => {
    setIsLoading(true)
    const plays = await getPlaysInPlaybook(playbookId)
    setPlaybookPlays(plays)
    setIsLoading(false)
  }
  
  // Load all plays not already in the playbook
  const loadAvailablePlays = async () => {
    setIsLoading(true)
    
    try {
      // First get IDs of plays already in the playbook
      const { data: existingPlays, error: existingError } = await supabase
        .from('playbook_plays')
        .select('play_id')
        .eq('playbook_id', playbookId)
      
      if (existingError) {
        console.error('Error fetching existing plays:', existingError)
        setIsLoading(false)
        return
      }
      
      // Get IDs to exclude
      const existingPlayIds = existingPlays?.map(p => p.play_id) || []
      
      // Now fetch plays not in the playbook
      let query = supabase.from('plays').select('*')
      
      // Only apply not-in filter if we have existing plays
      if (existingPlayIds.length > 0) {
        query = query.not('id', 'in', `(${existingPlayIds.join(',')})`)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching available plays:', error)
      } else {
        setAvailablePlays(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading available plays:', err)
    }
    
    setIsLoading(false)
  }
  
  // Add a play to the playbook
  const handleAddPlay = async () => {
    if (!selectedPlayId) return
    
    const success = await addPlayToPlaybook(playbookId, selectedPlayId)
    
    if (success) {
      // Refresh both lists
      await loadPlaybookPlays()
      await loadAvailablePlays()
      setSelectedPlayId('')
    }
  }
  
  // Remove a play from the playbook
  const handleRemovePlay = async (playId: string) => {
    if (window.confirm('Remove this play from the playbook?')) {
      const success = await removePlayFromPlaybook(playbookId, playId)
      
      if (success) {
        // Refresh both lists
        await loadPlaybookPlays()
        await loadAvailablePlays()
      }
    }
  }
  
  return (
    <div className="playbook-play-manager p-4">
      <h3 className="text-xl font-bold mb-4">Manage Plays in Playbook</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Add play form */}
      <div className="bg-white shadow-md rounded px-6 py-4 mb-4">
        <h4 className="font-medium mb-2">Add Play to Playbook</h4>
        <div className="flex">
          <select
            className="flex-grow shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            value={selectedPlayId}
            onChange={(e) => setSelectedPlayId(e.target.value)}
            disabled={isLoading || availablePlays.length === 0}
          >
            <option value="">Select a play to add...</option>
            {availablePlays.map((play) => (
              <option key={play.id} value={play.id}>
                {play.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddPlay}
            disabled={isLoading || !selectedPlayId}
          >
            Add Play
          </button>
        </div>
        {availablePlays.length === 0 && !isLoading && (
          <p className="text-gray-600 text-sm mt-2">
            No more plays available to add. Create new plays in the play editor.
          </p>
        )}
      </div>
      
      {/* Current plays in playbook */}
      <div className="bg-white shadow-md rounded px-6 py-4">
        <h4 className="font-medium mb-2">Plays in Playbook</h4>
        
        {isLoading ? (
          <p className="text-gray-600">Loading plays...</p>
        ) : playbookPlays.length === 0 ? (
          <p className="text-gray-600">No plays in this playbook yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {playbookPlays.map((play) => (
              <li key={play.id} className="py-3 flex justify-between items-center">
                <div>
                  <h5 className="font-medium">{play.name}</h5>
                  <p className="text-sm text-gray-600">
                    {play.type} play
                    {play.formation_name && ` • ${play.formation_name} formation`}
                  </p>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  onClick={() => handleRemovePlay(play.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PlaybookPlayManager
