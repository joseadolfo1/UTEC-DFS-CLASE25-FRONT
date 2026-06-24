import { OrderStatus } from '../types/order'

const colorMap: Record<OrderStatus, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  ENVIADO: 'bg-blue-100 text-blue-800',
  ENTREGADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
}

interface BadgeProps {
  status: OrderStatus
}

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorMap[status]}`}>
      {status}
    </span>
  )
}
