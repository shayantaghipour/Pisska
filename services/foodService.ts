import { api } from "./api";

export interface Food {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
}

export const getFoods = async (): Promise<Food[]> => {
  const response = await api.get<Food[]>("foods/");
  return response.data;
};