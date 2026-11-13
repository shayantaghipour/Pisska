import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addToCart: (
  item: Omit<CartItem, "quantity">,
  quantity: number
) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (item, quantity) =>
  set((state) => {
    const existingItem = state.items.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      return {
        items: state.items.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
              }
            : cartItem
        ),
      };
    }

    return {
      items: [...state.items, { ...item, quantity }],
    };
  }),

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
    })),

  clearCart: () => set({ items: [] }),
}));