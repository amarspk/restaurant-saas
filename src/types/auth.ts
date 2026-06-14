export type UserRole = 'super_admin' | 'restaurant_owner'

export interface UserProfile {
  id: string
  user_id: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: import('@supabase/supabase-js').User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}
