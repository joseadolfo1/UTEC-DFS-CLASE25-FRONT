import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { formatCurrency } from '../../../utils/formatCurrency'
import { Button } from '../../../components/Button'
import * as orderApi from '../../../api/orderApi'

export function Checkout() {
  const { items, total, clearLocalCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleConfirmOrder = async () => {
    setLoading(true)
    setError('')
    try {
      await orderApi.createOrder()
      clearLocalCart()
      navigate('/my-orders')
    } catch {
      setError('No se pudo crear la orden. Verifica el stock de los productos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Confirmar compra</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Resumen del pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-gray-700">
              {item.productName} × {item.quantity}
            </span>
            <span className="font-medium">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-4 border-t">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/cart')} className="flex-1">
          Volver al carrito
        </Button>
        <Button onClick={handleConfirmOrder} disabled={loading} className="flex-1 py-3">
          {loading ? 'Procesando...' : 'Confirmar compra'}
        </Button>
      </div>
    </div>
  )
}
