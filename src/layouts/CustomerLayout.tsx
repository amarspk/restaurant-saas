import { Outlet, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Restaurant } from '@/types/restaurant'
import type { Database } from '@/types/database'

type RestaurantRow = Database['public']['Tables']['restaurants']['Row']

export function CustomerLayout() {
  const { slug } = useParams<{ slug: string }>()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()
      .then(({ data }: { data: RestaurantRow | null }) => {
        if (data) {
          setRestaurant(data as unknown as Restaurant)
          document.documentElement.style.setProperty('--color-primary', data.theme_color)
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Restaurant not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet context={{ restaurant }} />
    </div>
  )
}
