import React from 'react'
import { useFormationState } from '../../store/formationState'
import { useToolState } from '../../store/toolState'
import { extractPlayersFromHistory } from '../../utils/formationUtils'

export function FormationSaveButton() {
  const { name, isSaving, error, setName, saveFormation, clearError } = useFormationState()
  const { history, currentIndex } = useToolState()

  const handleSave = async () => {
    const players = extractPlayersFromHistory(history, currentIndex)
    await saveFormation(players)
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Formation Name"
        className="w-36 px-3 py-2 text-sm bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Formation'}
      </button>
      {error && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  )
}
