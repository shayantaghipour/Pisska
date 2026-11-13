import { api } from "./api";

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string | null;
  gender: "" | "male" | "female" | "other" | "prefer_not_to_say";
}

export const profileService = {
  async getProfile() {
    const response = await api.get<UserProfile>("users/me/");
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const response = await api.patch<UserProfile>("users/me/", data);
    return response.data;
  },
};