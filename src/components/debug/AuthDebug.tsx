import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export function AuthDebug() {
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          setError(error.message)
          setUserId(null)
        } else {
          setUserId(data.user?.id || null)
          setError(null)
        }
      } catch (err) {
        setError('Failed to check auth status')
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Simple floating debug panel at the bottom of the screen
  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-md z-50 text-sm font-mono">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      {loading ? (
        <p>Checking auth...</p>
      ) : error ? (
        <div>
          <p className="text-red-400">Error: {error}</p>
          <p className="mt-2">Status: Not authenticated</p>
        </div>
      ) : (
        <div>
          <p className="text-green-400">Status: Authenticated</p>
          <p className="mt-1">User ID: {userId}</p>
          <details className="mt-2">
            <summary>Test RLS Access</summary>
            <button 
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from('formations').select('*').limit(1)
                  alert(error ? `Error: ${error.message}` : `Success! Found ${data?.length || 0} formations`)
                } catch (err) {
                  alert(`Error: ${err.message}`)
                }
              }}
              className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Test Read
            </button>
          </details>
        </div>
      )}
    </div>
  )
}
