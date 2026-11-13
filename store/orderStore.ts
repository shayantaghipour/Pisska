import { create } from "zustand";

export interface OrderItem {
id: string;
name: string;
price: number;
image?: number;
quantity: number;
}

export interface Order {
id: string;
items: OrderItem[];
total: number;
status: "Confirmed" | "Preparing" | "Delivered" | "Cancelled";
createdAt: string;
}

interface OrderStore {
orders: Order[];
placeOrder: (items: OrderItem[]) => void;
cancelOrder: (orderId: string) => void;
clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
orders: [],

placeOrder: (items) =>
set((state) => {
if (items.length === 0) return state;


  const orderItems = items.map((item) => ({ ...item }));

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const newOrder: Order = {
    id: `${Date.now()}`,
    items: orderItems,
    total,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  return {
    orders: [newOrder, ...state.orders],
  };
}),


cancelOrder: (orderId) =>
set((state) => ({
orders: state.orders.map((order) =>
order.id === orderId && order.status === "Confirmed"
? { ...order, status: "Cancelled" }
: order
),
})),

clearOrders: () => set({ orders: [] }),
}));
