import axios from "axios";

import { authStorage } from "./authStorage";

export const api = axios.create({
baseURL: "http://192.168.1.100:8000/api/",
timeout: 10000,
});

api.interceptors.request.use(async (config) => {
const accessToken = await authStorage.getAccessToken();

if (accessToken) {
config.headers.Authorization = `Bearer ${accessToken}`;
}

return config;
});
