export type OrderStatus = 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  userEmail: string
  userName: string
  status: OrderStatus
  total: number
  createdAt: string
  items: OrderItem[]
}
