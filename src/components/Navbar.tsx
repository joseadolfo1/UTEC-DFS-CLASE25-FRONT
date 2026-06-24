import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          ShopEasy
        </Link>

        {/* Links de navegacion */}
        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-primary transition-colors">
            Productos
          </Link>

          {user ? (
            <>
              {/* Carrito */}
              <Link to="/cart" className="relative text-gray-600 hover:text-primary">
                🛒
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Panel admin */}
              {isAdmin() && (
                <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors">
                  Admin
                </Link>
              )}

              {/* Info usuario + logout */}
              <div className="flex items-center gap-3">
                <Link to="/my-orders" className="text-gray-600 hover:text-primary text-sm">
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
                Ingresar
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
