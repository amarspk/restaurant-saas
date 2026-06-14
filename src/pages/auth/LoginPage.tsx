import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const { t } = useTranslation()
  const { signIn, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await signIn(email, password)
    setSubmitting(false)
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.login')}</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || loading}
          className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t('common.loading') : t('auth.login')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          {t('auth.register')}
        </Link>
      </p>
    </div>
  )
}
