import React from 'react'
import { usePlayState } from '../../store/playState'

export function HeaderToolbar() {
  const { 
    playName,
    formationName,
    defense,
    isSaving, 
    error,
    setPlayName,
    setFormationName,
    setDefense,
    savePlay,
    clearError 
  } = usePlayState()

  const isValid = playName.trim() && formationName.trim()

  const handleSave = () => {
    if (!isValid) return
    savePlay()
  }
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-6">
      <div className="flex space-x-2">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
          New Play
        </button>
        <button 
          onClick={() => window.location.href = '/playbooks'}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
          Playbooks
        </button>
        <button 
          onClick={() => window.location.href = '/team-settings'}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
          Team Settings
        </button>
      </div>
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
          <div className="absolute -bottom-6 left-0 right-0 text-center max-w-md mx-auto">
            <span className="text-xs text-red-500 whitespace-normal break-words">
              Error: {error}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
