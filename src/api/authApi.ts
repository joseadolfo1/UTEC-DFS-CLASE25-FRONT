import api from "./axiosInstance";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>("/auth/login", data).then((r) => r.data);

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>("/auth/register", data).then((r) => r.data);
