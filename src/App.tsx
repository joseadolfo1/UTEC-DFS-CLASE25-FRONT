import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

// Páginas públicas
import { Home } from './pages/public/Home'
import { ProductList } from './pages/public/ProductList'
import { ProductDetail } from './pages/public/ProductDetail'
import { Login } from './pages/public/Login'
import { Register } from './pages/public/Register'

// Páginas de usuario autenticado
import { Cart } from './pages/private/user/Cart'
import { Checkout } from './pages/private/user/Checkout'
import { OrderHistory } from './pages/private/user/OrderHistory'

// Páginas de administrador
import { Dashboard } from './pages/private/admin/Dashboard'
import { ProductManager } from './pages/private/admin/ProductManager'
import { CategoryManager } from './pages/private/admin/CategoryManager'
import { OrderManager } from './pages/private/admin/OrderManager'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas para usuarios autenticados */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<OrderHistory />} />
              </Route>

              {/* Rutas solo para administradores */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductManager />} />
                <Route path="/admin/categories" element={<CategoryManager />} />
                <Route path="/admin/orders" element={<OrderManager />} />
              </Route>
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
