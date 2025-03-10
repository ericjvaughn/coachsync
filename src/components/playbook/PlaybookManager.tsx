import React, { useState, useEffect } from 'react'
import { usePlaybookState } from '../../store/playbookState'

const PlaybookManager: React.FC = () => {
  const { 
    playbooks, 
    fetchPlaybooks, 
    createPlaybook, 
    updatePlaybook,
    deletePlaybook,
    error,
    isLoading,
    isSaving
  } = usePlaybookState()
  
  const [newPlaybookName, setNewPlaybookName] = useState('')
  const [newPlaybookDescription, setNewPlaybookDescription] = useState('')
  const [editMode, setEditMode] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  
  // Load playbooks on component mount
  useEffect(() => {
    fetchPlaybooks()
  }, [fetchPlaybooks])
  
  const handleCreatePlaybook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlaybookName.trim()) return
    
    await createPlaybook({
      name: newPlaybookName.trim(),
      description: newPlaybookDescription.trim() || undefined,
      type: 'offense' // Using valid formation_type enum value
    })
    
    // Reset form
    setNewPlaybookName('')
    setNewPlaybookDescription('')
  }
  
  const handleStartEdit = (playbook: any) => {
    setEditMode(playbook.id)
    setEditName(playbook.name)
    setEditDescription(playbook.description || '')
  }
  
  const handleCancelEdit = () => {
    setEditMode(null)
    setEditName('')
    setEditDescription('')
  }
  
  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return
    
    await updatePlaybook({
      id,
      name: editName.trim(),
      description: editDescription.trim() || undefined,
      type: 'offense' // Using valid formation_type enum value
    })
    
    setEditMode(null)
  }
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this playbook?')) {
      await deletePlaybook(id)
    }
  }
  
  return (
    <div className="playbook-manager p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Playbooks</h2>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600 text-white"
        >
          Back to Editor
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Create new playbook form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-lg font-semibold mb-2">Create New Playbook</h3>
        <form onSubmit={handleCreatePlaybook}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playbook-name">
              Playbook Name
            </label>
            <input 
              id="playbook-name"
              type="text" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              value={newPlaybookName}
              onChange={(e) => setNewPlaybookName(e.target.value)}
              placeholder="Enter playbook name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playbook-description">
              Description (Optional)
            </label>
            <textarea 
              id="playbook-description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              value={newPlaybookDescription}
              onChange={(e) => setNewPlaybookDescription(e.target.value)}
              placeholder="Enter playbook description"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSaving || !newPlaybookName.trim()}
            >
              {isSaving ? 'Creating...' : 'Create Playbook'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Playbooks list */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h3 className="text-lg font-semibold mb-2">Your Playbooks</h3>
        
        {isLoading ? (
          <p className="text-gray-600">Loading playbooks...</p>
        ) : playbooks.length === 0 ? (
          <p className="text-gray-600">No playbooks yet. Create your first playbook above.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {playbooks.map((playbook) => (
              <li key={playbook.id} className="py-4">
                {editMode === playbook.id ? (
                  <div className="edit-form">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Playbook name"
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                        onClick={() => handleSaveEdit(playbook.id!)}
                        disabled={!editName.trim()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium">{playbook.name}</h4>
                        {playbook.description && (
                          <p className="text-gray-600 mt-1">{playbook.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(playbook.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => handleStartEdit(playbook)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => handleDelete(playbook.id!)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PlaybookManager
