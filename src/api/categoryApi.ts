import api from './axiosInstance'
import { Category, CategoryRequest } from '../types/category'

export const getAll = () =>
  api.get<Category[]>('/categories').then((r) => r.data)

export const getById = (id: number) =>
  api.get<Category>(`/categories/${id}`).then((r) => r.data)

export const create = (data: CategoryRequest) =>
  api.post<Category>('/categories', data).then((r) => r.data)

export const update = (id: number, data: CategoryRequest) =>
  api.put<Category>(`/categories/${id}`, data).then((r) => r.data)

export const remove = (id: number) =>
  api.delete(`/categories/${id}`)
