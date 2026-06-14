export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  restaurant_id: string
  branch_id: string | null
  customer_name: string
  customer_phone: string
  customer_notes: string | null
  status: OrderStatus
  total_amount: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name_en: string
  product_name_ar: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface CartItem {
  product_id: string
  name_en: string
  name_ar: string
  price: number
  quantity: number
  image_url?: string | null
}

export interface Cart {
  restaurant_id: string
  items: CartItem[]
  total: number
}
