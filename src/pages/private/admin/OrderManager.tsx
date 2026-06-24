import { useEffect, useState } from 'react'
import { Order, OrderStatus } from '../../../types/order'
import { Badge } from '../../../components/Badge'
import { formatCurrency } from '../../../utils/formatCurrency'
import * as orderApi from '../../../api/orderApi'

const statuses: OrderStatus[] = ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => orderApi.getAll().then((data) => { setOrders(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    await orderApi.updateStatus(orderId, status)
    load()
  }

  if (loading) return <p className="text-center py-20 text-gray-400">Cargando...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de pedidos</h1>

      <div className="space-y-4">
        {orders.length === 0 && <p className="text-gray-400">No hay pedidos aún.</p>}
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
              <div>
                <p className="font-semibold text-gray-800">Pedido #{order.id}</p>
                <p className="text-sm text-gray-500">{order.userName} — {order.userEmail}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString('es-PE')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={order.status} />
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item) => (
                <p key={item.id} className="text-sm text-gray-600">
                  {item.productName} × {item.quantity} — {formatCurrency(item.subtotal)}
                </p>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t">
              <span className="font-bold text-primary text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
