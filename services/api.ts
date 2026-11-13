import axios from "axios";

import { authStorage } from "./authStorage";

export const api = axios.create({
baseURL: process.env.EXPO_PUBLIC_API_URL,
timeout: 10000,
});

api.interceptors.request.use(async (config) => {
const accessToken = await authStorage.getAccessToken();

if (accessToken) {
config.headers.Authorization = `Bearer ${accessToken}`;
}

return config;
});
