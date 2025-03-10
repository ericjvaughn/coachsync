import React from 'react'
import { useToolState } from '../../store/toolState'
import { FiGrid, FiCrosshair, FiTrash2 } from 'react-icons/fi'

export function BottomToolbar() {
  const { currentTool, setTool, gridEnabled, toggleGrid, alignmentGuidesEnabled, toggleAlignmentGuides } = useToolState()

  return (
    <div className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 flex justify-center py-1.5 px-4 bg-gray-800/95 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2">
        {/* Primary Tools */}
        <button
          onClick={() => setTool('select')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'select' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Select
        </button>
        <button
          onClick={() => setTool('offense')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'offense' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Offense
        </button>
        <button
          onClick={() => setTool('defense')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'defense' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Defense
        </button>
        <button
          onClick={() => setTool('oline')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'oline' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          O-Line
        </button>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-600 mx-1"></div>

        {/* Route Tools */}
        <button
          onClick={() => setTool('color')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'color' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setTool('path')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'path' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Route
        </button>

        {/* Path End Types */}
        <button
          onClick={() => setTool('circle')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'circle' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Small Circle
        </button>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-600 mx-1"></div>

        <button
          onClick={() => setTool('arrow')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'arrow' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Arrow
        </button>
        <button
          onClick={() => setTool('block')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors ${
            currentTool === 'block' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Flat Line
        </button>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-600 mx-1"></div>

        {/* Remove Tool */}
        <button
          onClick={() => setTool('remove')}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors flex items-center ${
            currentTool === 'remove' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Remove Objects (Delete)"
        >
          <FiTrash2 className="mr-1" />
          Remove
        </button>
        
        {/* Separator */}
        <div className="h-5 w-px bg-gray-600 mx-1"></div>
        
        {/* Precision Placement Tools */}
        <button
          onClick={toggleGrid}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors flex items-center ${
            gridEnabled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Toggle Grid (G)"
        >
          <FiGrid className="mr-1" />
          Grid
        </button>
        <button
          onClick={toggleAlignmentGuides}
          className={`px-2.5 py-1.5 text-sm font-medium rounded hover:bg-opacity-80 transition-colors flex items-center ${
            alignmentGuidesEnabled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Toggle Alignment Guides (A)"
        >
          <FiCrosshair className="mr-1" />
          Align
        </button>
      </div>
    </div>
  )
}
