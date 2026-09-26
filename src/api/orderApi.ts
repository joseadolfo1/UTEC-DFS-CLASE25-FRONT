import api from "./axiosInstance";
import { Order, OrderStatus } from "../types/order";

export const createOrder = () => api.post<Order>("/orders").then((r) => r.data);

export const getMyOrders = () =>
  api.get<Order[]>("/orders/my").then((r) => r.data);

export const getAll = () => api.get<Order[]>("/orders").then((r) => r.data);

export const getById = (id: number) =>
  api.get<Order>(`/orders/${id}`).then((r) => r.data);

export const updateStatus = (id: number, status: OrderStatus) =>
  api.put<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);
