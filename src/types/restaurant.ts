export type RestaurantStatus = 'active' | 'suspended' | 'pending'

export interface Restaurant {
  id: string
  owner_id: string
  name_en: string
  name_ar: string
  slug: string
  logo_url: string | null
  theme_color: string
  status: RestaurantStatus
  created_at: string
  updated_at: string
}

export interface Branch {
  id: string
  restaurant_id: string
  name_en: string
  name_ar: string
  address_en: string | null
  address_ar: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  restaurant_id: string
  name_en: string
  name_ar: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  restaurant_id: string
  category_id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  price: number
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
  images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  sort_order: number
}
