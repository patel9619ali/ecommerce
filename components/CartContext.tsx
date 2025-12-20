'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type CartItem = {
  id: number
  title: string
  price: number
}

type CartContextType = {
  cartItems: CartItem[]
  addItem: (item: CartItem) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
  }

  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider value={{ cartItems, addItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
    