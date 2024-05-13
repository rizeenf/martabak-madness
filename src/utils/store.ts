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
        set((prev) => {
          const duplicateItemIndex = prev.products.findIndex((x) => item.id === x.id);

          if (duplicateItemIndex !== -1) {
            // If a duplicate item is found, update its quantity
            const updatedProducts = prev.products.map((product, index) => {
              if (index === duplicateItemIndex) {
                // Update the quantity of the duplicate item
                return {
                  ...product,
                  quantity: product.quantity + item.quantity
                };
              }
              return product;
            });

            return {
              products: updatedProducts,
              totalItems: prev.totalItems,
              totalPrice: prev.totalPrice + (item.price * item.quantity)
            };
          } else {
            // If no duplicate item is found, add the new item to the cart
            return {
              products: [...prev.products, item],
              totalItems: prev.totalItems + 1,
              totalPrice: prev.totalPrice + (item.price * item.quantity)
            };
          }
          // const duplicateItems = prev.products.find((x) => item.id == x.id)

          // if (duplicateItems){
          //   return {
          //     products: [...prev.products, { quantity: duplicateItems.quantity + item.quantity}]
          //   }
          // }
          // return {
          //   products: [...prev.products, item],
          //   totalItems: prev.totalItems + item.quantity,
          //   totalPrice: prev.totalPrice + (item.price * item.quantity)
          // }
        })
      },
      removeFromCart(item) {
        set((prev) => {
          console.log(prev, "prev")
          const removedItem = prev.products.find((product) => product.id === item.id)

          let updatedProducts = prev.products.filter((prod) => prod.id !== item.id)

          let updatedTotalItems = prev.totalItems;
          let updatedTotalPrice = prev.totalPrice;

          if (removedItem) {
            updatedTotalPrice = updatedTotalPrice - (removedItem.price * removedItem.quantity);
            updatedTotalItems -= 1
          }

          // If there's only one item left, reset the cart
          if (updatedTotalItems == 0) {
            updatedTotalPrice = 0;
            updatedTotalItems = 0;
            updatedProducts = [];
          }

          return {
            products: updatedProducts,
            totalItems: updatedTotalItems,
            totalPrice: updatedTotalPrice
          }

        }
        )
      },
    }), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
  }
  ))