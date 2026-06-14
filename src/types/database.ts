/**
 * Supabase generated types placeholder.
 * Replace this file with the output of `supabase gen types typescript`
 * once the schema migrations have been applied.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          role: 'super_admin' | 'restaurant_owner'
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string
          name_en: string
          name_ar: string
          slug: string
          logo_url: string | null
          theme_color: string
          status: 'active' | 'suspended' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>
      }
      branches: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['branches']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['branches']['Insert']>
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name_en: string
          name_ar: string
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          is_primary: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          branch_id: string | null
          customer_name: string
          customer_phone: string
          customer_notes: string | null
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name_en: string
          product_name_ar: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'super_admin' | 'restaurant_owner'
      restaurant_status: 'active' | 'suspended' | 'pending'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
    }
  }
}
