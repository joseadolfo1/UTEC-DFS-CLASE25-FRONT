import api from "./axiosInstance";
import { CartItem, CartItemRequest } from "../types/cart";

export const getCart = () => api.get<CartItem[]>("/cart").then((r) => r.data);

export const addItem = (data: CartItemRequest) =>
  api.post<CartItem>("/cart", data).then((r) => r.data);

export const updateItem = (itemId: number, quantity: number) =>
  api
    .put<CartItem>(`/cart/${itemId}`, null, { params: { quantity } })
    .then((r) => r.data);

export const removeItem = (itemId: number) => api.delete(`/cart/${itemId}`);
