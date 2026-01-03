"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

const EMI_OPTIONS = [
  { months: 3, interest: 0 },
  { months: 6, interest: 5 },
  { months: 12, interest: 10 },
];

export default function CheckoutPage() {
  const [emi, setEmi] = useState<number | null>(null);
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();


  if (!items.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
      </div>
    );
  }
  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const emiAmount =
    emi !== null
      ? Math.round(
          (total * (1 + EMI_OPTIONS.find(e => e.months === emi)!.interest / 100)) /
            emi
        )
      : null;

  return (
    <>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 border p-4 rounded-lg"
        >
          <img src={item.image} width={80} />

          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm opacity-70">
              Variant: {item.variantKey}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold">₹ {item.price}</p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      <button onClick={() => router.push("/payment")} className="w-full bg-black text-white py-3 rounded-lg" >
        Place Order
      </button>
    </div>
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-3">EMI Options</h2>

        {EMI_OPTIONS.map((e) => (
          <label key={e.months} className="flex gap-2 mb-2">
            <input
              type="radio"
              name="emi"
              onChange={() => setEmi(e.months)}
            />
            {e.months} months {e.interest}% interest
          </label>
        ))}

        {emiAmount && (
          <p className="mt-3 font-semibold">
            EMI: ₹ {emiAmount} / month
          </p>
        )}
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded-lg">
        Pay ₹ {total}
      </button>
    </div>
    </>
  );
}
