import { api } from "./api";
import { authStorage } from "./authStorage";

export interface RegisterData {
email: string;
password: string;
first_name: string;
last_name: string;
phone_number?: string;
}

export interface LoginData {
email: string;
password: string;
}

export interface AuthResponse {
access: string;
refresh: string;
}

export const authService = {
async register(data: RegisterData) {
const response = await api.post(
"users/register/",
data
);


return response.data;


},

async login(data: LoginData) {
const response = await api.post<AuthResponse>(
"users/login/",
data
);


await authStorage.saveTokens(
  response.data.access,
  response.data.refresh
);

return response.data;


},

async logout() {
await authStorage.clearTokens();
},

async isAuthenticated() {
const accessToken = await authStorage.getAccessToken();
const refreshToken = await authStorage.getRefreshToken();


return Boolean(accessToken && refreshToken);


},
};
