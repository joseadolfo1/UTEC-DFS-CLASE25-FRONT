import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as productApi from '../../../api/productApi'
import * as categoryApi from '../../../api/categoryApi'
import * as orderApi from '../../../api/orderApi'

export function Dashboard() {
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    productApi.getAll().then((p) => setProductCount(p.length))
    categoryApi.getAll().then((c) => setCategoryCount(c.length))
    orderApi.getAll().then((orders) => {
      setPendingOrders(orders.filter((o) => o.status === 'PENDIENTE').length)
    })
  }, [])

  const cards = [
    { label: 'Productos', value: productCount, link: '/admin/products', color: 'bg-blue-50 text-blue-700' },
    { label: 'Categorías', value: categoryCount, link: '/admin/categories', color: 'bg-purple-50 text-purple-700' },
    { label: 'Pedidos pendientes', value: pendingOrders, link: '/admin/orders', color: 'bg-yellow-50 text-yellow-700' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`rounded-xl p-6 ${card.color} hover:shadow-md transition-shadow`}
          >
            <p className="text-4xl font-bold mb-2">{card.value}</p>
            <p className="font-medium">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
