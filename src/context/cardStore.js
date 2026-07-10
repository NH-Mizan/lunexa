import { create } from "zustand";
import { persist } from "zustand/middleware";

const useShopStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      compare: [],

      //  Add to Cart
      addToCart: (product) =>
        set((state) => {
          // 👉 same product + size + color match
          const alreadyExist = state.cart.find(
            (item) =>
              item.id === product.id &&
              item.size === product.size &&
              item.color === product.color
          );

          if (alreadyExist) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id &&
                  item.size === product.size &&
                  item.color === product.color
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        }),


      increaseQty: (product) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === product.id &&
              item.size === product.size &&
              item.color === product.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQty: (product) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === product.id &&
              item.size === product.size &&
              item.color === product.color &&
              item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        })),

      //  Add to Wishlist
      addToWishlist: (product) =>
        set((state) => {
          const alreadyExist = state.wishlist.find((item) => item.id === product.id);
          if (alreadyExist) return state;
          return { wishlist: [...state.wishlist, product] };
        }),

      //  Add to Compare
      addToCompare: (product) =>
        set((state) => {
          const alreadyExist = state.compare.find((item) => item.id === product.id);
          if (alreadyExist) return state;
          return { compare: [...state.compare, product] };
        }),


      //  Add to Cart and Remove from Wishlist
      addToCartFromWishlist: (product) =>
        set((state) => {
          const alreadyExist = state.cart.find((item) => item.id === product.id);
          let updatedCart;

          if (alreadyExist) {
            updatedCart = state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return {
            cart: updatedCart,
            wishlist: state.wishlist.filter((item) => item.id !== product.id),
          };
        }),

      //  Add to Cart and Remove from Compare
      addToCartFromCompare: (product) =>
        set((state) => {
          const alreadyExist = state.cart.find((item) => item.id === product.id);
          let updatedCart;

          if (alreadyExist) {
            updatedCart = state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return {
            cart: updatedCart,
            compare: state.compare.filter((item) => item.id !== product.id),
          };
        }),


      //  Remove from Cart
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.id === product.id &&
                item.size === product.size &&
                item.color === product.color
              )
          ),
          
        })),

      //  Clear Cart
      clearCart: () => set({ cart: [] }),

      //  Remove from Wishlist
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        })),

      //  Remove from Compare
      removeFromCompare: (id) =>
        set((state) => ({
          compare: state.compare.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "shop-storage",
    }
  )
);

export default useShopStore;

