'use client'

import { Button } from "./ui/button"
import { useCart } from "./CartContext"

export default function DummyButton() {
  const { addItem, clearCart } = useCart()

  return (
    <div className="relative flex gap-2 z-[999]">
      <Button
        onClick={() =>
          addItem({ id: 1, title: "Dummy Product 1", price: 1000 })
        }
      >
        Add 1 Item
      </Button>

      <Button
        onClick={() =>
          addItem({
            id: Date.now(),
            title: "Dummy Product 2",
            price: 2000,
          })
        }
      >
        Add Another Item
      </Button>

      <Button variant="destructive" onClick={clearCart}>
        Clear Cart
      </Button>
    </div>
  )
}
