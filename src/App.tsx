import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'
import { AuthProvider } from './contexts/AuthContext'
import { supabaseConfigured } from './lib/supabase'

function SetupBanner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant SaaS</h1>
        <p className="text-gray-500 mb-6">
          Connect a Supabase project to get started.
        </p>
        <div className="bg-gray-900 rounded-xl p-4 text-left text-sm font-mono text-green-400 mb-6">
          <p className="text-gray-500 mb-1"># .env.local</p>
          <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=your-anon-key</p>
        </div>
        <ol className="text-left text-sm text-gray-600 space-y-2">
          <li><span className="font-semibold text-gray-900">1.</span> Create a project at <a href="https://app.supabase.com" className="text-orange-500 underline" target="_blank" rel="noreferrer">app.supabase.com</a></li>
          <li><span className="font-semibold text-gray-900">2.</span> Run <code className="bg-gray-100 px-1 rounded">supabase/schema.sql</code> in the SQL editor</li>
          <li><span className="font-semibold text-gray-900">3.</span> Add env vars above (Replit Secrets panel)</li>
          <li><span className="font-semibold text-gray-900">4.</span> Restart the workflow</li>
        </ol>
      </div>
    </div>
  )
}

export default function App() {
  if (!supabaseConfigured) return <SetupBanner />

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
