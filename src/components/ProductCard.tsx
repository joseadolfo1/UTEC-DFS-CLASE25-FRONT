import { useNavigate } from 'react-router-dom'
import { Product } from '../types/product'
import { formatCurrency } from '../utils/formatCurrency'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    await addItem(product.id, 1)
  }

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      <img
        src={product.imageUrl || 'https://placehold.co/400x300?text=Sin+imagen'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.categoryName}</p>
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
        <p className="text-primary font-bold text-xl mt-1">{formatCurrency(product.price)}</p>
        <p className="text-sm text-gray-500 mt-1">
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  )
}
