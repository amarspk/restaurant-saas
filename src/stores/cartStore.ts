import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/order'

interface CartStore {
  restaurantId: string | null
  items: CartItem[]
  addItem: (restaurantId: string, item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      items: [],

      addItem(restaurantId, item) {
        const { items, restaurantId: currentRestaurantId } = get()

        // If switching restaurant, clear cart first
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          set({ restaurantId, items: [{ ...item, quantity: 1 }] })
          return
        }

        const existing = items.find((i) => i.product_id === item.product_id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ restaurantId, items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem(productId) {
        set({ items: get().items.filter((i) => i.product_id !== productId) })
      },

      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart() {
        set({ restaurantId: null, items: [] })
      },

      total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    { name: 'restaurant-cart' }
  )
)
