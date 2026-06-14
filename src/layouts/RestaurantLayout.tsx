import { Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'

export function RestaurantLayout() {
  const { t } = useTranslation()
  const { signOut } = useAuth()

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), end: true },
    { to: '/dashboard/categories', label: t('nav.categories') },
    { to: '/dashboard/products', label: t('nav.products') },
    { to: '/dashboard/orders', label: t('nav.orders') },
    { to: '/dashboard/branches', label: t('nav.branches') },
    { to: '/dashboard/settings', label: t('nav.settings') },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-e border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">🍽️ Restaurant Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-[var(--color-primary)]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
          >
            {t('auth.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
