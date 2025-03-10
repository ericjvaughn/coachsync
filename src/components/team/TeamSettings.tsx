import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Team {
  id: string
  name: string
  school_name: string
  mascot: string
  level: string
  season: string
}

export function TeamSettings() {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    school_name: '',
    mascot: '',
    level: 'varsity',
    season: new Date().getFullYear().toString()
  })

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id)
        .maybeSingle()

      if (error) throw error

      if (team) {
        setTeam(team)
        setFormData({
          name: team.name,
          school_name: team.school_name,
          mascot: team.mascot || '',
          level: team.level,
          season: team.season
        })
      }
    } catch (error) {
      console.error('Error loading team:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      console.log('Current user:', user)
      
      const teamData = {
        ...formData,
        created_by: user.id
      }

      let result
      if (team) {
        // Update existing team
        result = await supabase
          .from('teams')
          .update(teamData)
          .eq('id', team.id)
          .select()
      } else {
        // Create new team
        result = await supabase
          .from('teams')
          .insert([teamData])
          .select()
      }

      if (result.error) throw result.error

      // Redirect back to main page
      window.location.href = '/'
    } catch (error) {
      console.error('Error saving team:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Team Settings</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600"
          >
            Back to Editor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Team Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">School Name</label>
            <input
              type="text"
              value={formData.school_name}
              onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Mascot</label>
            <input
              type="text"
              value={formData.mascot}
              onChange={(e) => setFormData(prev => ({ ...prev, mascot: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="varsity">Varsity</option>
              <option value="jv">JV</option>
              <option value="freshman">Freshman</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Season</label>
            <input
              type="text"
              value={formData.season}
              onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
          </button>
        </form>
      </div>
    </div>
  )
}
