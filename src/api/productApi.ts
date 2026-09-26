import api from "./axiosInstance";
import { Product, ProductRequest } from "../types/product";

export const getAll = (categoryId?: number) =>
  api
    .get<Product[]>("/products", { params: categoryId ? { categoryId } : {} })
    .then((r) => r.data);

export const getById = (id: number) =>
  api.get<Product>(`/products/${id}`).then((r) => r.data);

export const create = (data: ProductRequest) =>
  api.post<Product>("/products", data).then((r) => r.data);

export const update = (id: number, data: ProductRequest) =>
  api.put<Product>(`/products/${id}`, data).then((r) => r.data);

export const remove = (id: number) => api.delete(`/products/${id}`);
