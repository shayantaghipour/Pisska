import { api } from "./api";

export interface CreateOrderItem {
id: string;
quantity: number;
}

export interface OrderResponseItem {
id: number;
food: number;
food_name: string;
quantity: number;
price: string;
}

export interface OrderResponse {
id: number;
status: string;
total: string;
created_at: string;
items: OrderResponseItem[];
}

export const createOrder = async (
items: CreateOrderItem[],
): Promise<OrderResponse> => {
const response = await api.post<OrderResponse>("foods/orders/", {
items,
});
return response.data;
};

export const getOrders = async (): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>("foods/orders/");
  return response.data;
};

export const cancelOrder = async (
  orderId: number,
): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>(
    `foods/orders/${orderId}/cancel/`,
  );

  return response.data;
};


