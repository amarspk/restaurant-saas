import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/* Layouts */
import { AdminLayout } from '@/layouts/AdminLayout'
import { RestaurantLayout } from '@/layouts/RestaurantLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

/* Auth pages */
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'

/* Admin pages */
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminRestaurants } from '@/pages/admin/AdminRestaurants'
import { AdminUsers } from '@/pages/admin/AdminUsers'

/* Restaurant owner pages */
import { RestaurantDashboard } from '@/pages/restaurant/RestaurantDashboard'
import { RestaurantCategories } from '@/pages/restaurant/RestaurantCategories'
import { RestaurantProducts } from '@/pages/restaurant/RestaurantProducts'
import { RestaurantOrders } from '@/pages/restaurant/RestaurantOrders'
import { RestaurantBranches } from '@/pages/restaurant/RestaurantBranches'
import { RestaurantSettings } from '@/pages/restaurant/RestaurantSettings'

/* Customer pages */
import { CustomerHome } from '@/pages/customer/CustomerHome'
import { CustomerMenu } from '@/pages/customer/CustomerMenu'
import { CustomerCart } from '@/pages/customer/CustomerCart'
import { CustomerCheckout } from '@/pages/customer/CustomerCheckout'

/* Guards */
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <Routes>
      {/* ── Public Auth ─────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Super Admin ──────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* ── Restaurant Owner ─────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="restaurant_owner">
            <RestaurantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RestaurantDashboard />} />
        <Route path="categories" element={<RestaurantCategories />} />
        <Route path="products" element={<RestaurantProducts />} />
        <Route path="orders" element={<RestaurantOrders />} />
        <Route path="branches" element={<RestaurantBranches />} />
        <Route path="settings" element={<RestaurantSettings />} />
      </Route>

      {/* ── Customer-facing (per restaurant slug) ────────────── */}
      <Route path="/:slug" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="menu" element={<CustomerMenu />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
      </Route>

      {/* ── Root redirect ────────────────────────────────────── */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : profile?.role === 'super_admin' ? (
            <Navigate to="/admin" replace />
          ) : profile?.role === 'restaurant_owner' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
