import { useEffect, useState } from 'react'

export function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Collect all environment variables starting with VITE_
    const vars: Record<string, string> = {}
    
    // Safe check for import.meta
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      Object.keys(import.meta.env).forEach(key => {
        if (key.startsWith('VITE_')) {
          // Mask the actual values for security, just show if they exist
          const value = import.meta.env[key]
          vars[key] = value ? (key.includes('KEY') ? '***' : `${value.substring(0, 3)}...`) : 'undefined'
        }
      })
    }
    
    setEnvVars(vars)
  }, [])

  return (
    <div className="fixed top-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-md z-50 text-sm font-mono">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      {Object.keys(envVars).length === 0 ? (
        <p>No VITE_ environment variables found</p>
      ) : (
        <ul>
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value ? 'Exists' : 'Missing'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
