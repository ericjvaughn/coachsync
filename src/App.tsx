import './App.css'
import { FieldCanvas } from './components/field/FieldCanvas'
import { Field } from './components/field/Field'
import { HeaderToolbar } from './components/toolbar/HeaderToolbar'
import { BottomToolbar } from './components/toolbar/BottomToolbar'
import { Auth } from './components/auth/Auth'
import { TeamSettings } from './components/team/TeamSettings'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { AuthDebug } from './components/debug/AuthDebug'
import { EnvDebug } from './components/debug/EnvDebug'
import PlaybookManager from './components/playbook/PlaybookManager'
import PlaybookPlayManager from './components/playbook/PlaybookPlayManager'

function App(): JSX.Element {
  const session = useSession()
  const supabase = useSupabaseClient()

  useEffect(() => {
    // Handle email confirmation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if we have a hash parameter (from email confirmation)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          // Clear the hash to avoid confusion
          window.location.hash = ''
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])
  // Simple route handling
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePathChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePathChange)
    return () => window.removeEventListener('popstate', handlePathChange)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {!session ? (
        <Auth />
      ) : currentPath === '/team-settings' ? (
        <TeamSettings />
      ) : currentPath === '/playbooks' ? (
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-3">
              <h1 className="text-2xl font-bold text-white">FootballChalk</h1>
            </div>
            <PlaybookManager />
          </div>
        </div>
      ) : (
        <>
          {/* Logo */}
          <div className="absolute top-4 left-4 z-50">
            <h1 className="text-xl font-bold text-white">CoachSync</h1>
          </div>

          {/* Header Toolbar */}
          <HeaderToolbar />

          {/* Main Content - Field Canvas Container */}
          <div className="flex-1 flex items-center justify-center bg-gray-900 min-h-0">
            <div className="relative w-[1000px] h-[569px] mt-12">
              <FieldCanvas width={1000} height={569}>
                <Field width={1000} height={569} />
              </FieldCanvas>
              <BottomToolbar />
            </div>
          </div>
        </>
      )}
      
      {/* Debug Panels - Conditionally rendered based on development flag */}
      {/* Set to false to hide, true to show */}
      {import.meta.env.DEV && false && (
        <>
          <AuthDebug />
          <EnvDebug />
        </>
      )}
    </div>
  )
}

export default App
