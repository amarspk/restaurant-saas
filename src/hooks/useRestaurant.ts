import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Restaurant } from '@/types/restaurant'
import { useAuth } from '@/contexts/AuthContext'

export function useMyRestaurant() {
  const { profile } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', profile.id)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') setError(error.message)
        setRestaurant(data as Restaurant | null)
        setLoading(false)
      })
  }, [profile])

  return { restaurant, loading, error }
}
