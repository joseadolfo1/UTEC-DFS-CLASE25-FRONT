import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '../types/cart'
import * as cartApi from '../api/cartApi'
import { useAuth } from './AuthContext'

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (productId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  refreshCart: () => Promise<void>
  clearLocalCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      return
    }
    try {
      const data = await cartApi.getCart()
      setItems(data)
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const addItem = async (productId: number, quantity: number) => {
    await cartApi.addItem({ productId, quantity })
    await refreshCart()
  }

  const removeItem = async (itemId: number) => {
    await cartApi.removeItem(itemId)
    await refreshCart()
  }

  const clearLocalCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, refreshCart, clearLocalCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
