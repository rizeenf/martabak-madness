import { ActionType, CartType } from "@/config/type"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0
}

export const useCartStore = create<CartType & ActionType>()(
  persist(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart(item) {
        set((prev) => ({
          products: [...prev.products, item],
          totalItems: prev.totalItems + item.quantity,
          totalPrice: prev.totalPrice + (item.price * item.quantity)
        }))
      },
      removeFromCart(item) {
        set((prev) => ({
          products: prev.products.filter((prod) => prod.id !== item.id),
          totalItems: prev.totalItems - item.quantity,
          totalPrice: prev.totalPrice - (item.price * item.quantity)
        }))
      },
    }), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
  }
  ))