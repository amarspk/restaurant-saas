import { useOutletContext } from 'react-router-dom'
import type { Restaurant } from '@/types/restaurant'

export function CustomerHome() {
  const { restaurant } = useOutletContext<{ restaurant: Restaurant }>()

  return (
    <div className="min-h-screen">
      <div
        className="h-40 flex items-center justify-center"
        style={{ backgroundColor: restaurant.theme_color + '20' }}
      >
        {restaurant.logo_url && (
          <img src={restaurant.logo_url} alt={restaurant.name_en} className="h-24 object-contain" />
        )}
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">{restaurant.name_en}</h1>
        <p className="text-gray-500 mt-8 text-sm">Category cards will be implemented in Step 2.</p>
      </div>
    </div>
  )
}
