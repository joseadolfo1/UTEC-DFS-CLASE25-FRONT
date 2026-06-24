# ShopEasy — Propuesta de Frontend (React + Vite + TypeScript + TailwindCSS)

## Stack y dependencias

| Paquete              | Propósito                                        |
|----------------------|--------------------------------------------------|
| `vite`               | Bundler ultrarrápido para el proyecto React      |
| `react` + `react-dom`| Librería principal de UI                         |
| `typescript`         | Tipado estático                                  |
| `tailwindcss`        | Estilos con clases utilitarias                   |
| `react-router-dom`   | Enrutamiento del lado del cliente (v6)           |
| `axios`              | Cliente HTTP con soporte de interceptores        |

---

## Crear el proyecto

```bash
npm create vite@latest shopeasy-frontend -- --template react-ts
cd shopeasy-frontend
npm install
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install
npm run dev
```

### Configuración de TailwindCSS (`tailwind.config.js`)
```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",   // azul principal
        secondary: "#1E40AF",
      }
    }
  },
  plugins: []
}
```

### Variable de entorno (`.env`)
```
VITE_API_URL=http://localhost:8080/api
```

---

## Estructura de carpetas

```
src/
│
├── api/
│   ├── axiosInstance.ts         ← Instancia de Axios con baseURL y interceptor JWT
│   ├── authApi.ts               ← login(), register()
│   ├── productApi.ts            ← getAll(), getById(), create(), update(), remove()
│   ├── categoryApi.ts           ← getAll(), create(), update(), remove()
│   ├── cartApi.ts               ← getCart(), addItem(), updateItem(), removeItem()
│   └── orderApi.ts              ← createOrder(), getMyOrders(), getAll(), updateStatus()
│
├── components/
│   ├── Navbar.tsx               ← Logo, links, ícono de carrito, menú de usuario
│   ├── ProductCard.tsx          ← Tarjeta con imagen, nombre, precio y botón "Agregar"
│   ├── CartIcon.tsx             ← Ícono con badge del número de ítems
│   ├── Badge.tsx                ← Chip de estado (PENDIENTE, ENVIADO…)
│   ├── Button.tsx               ← Botón reutilizable con variantes (primary, danger)
│   ├── Modal.tsx                ← Ventana modal genérica
│   ├── ProtectedRoute.tsx       ← Redirige a /login si no hay token
│   └── AdminRoute.tsx           ← Redirige si el rol no es ADMIN
│
├── context/
│   ├── AuthContext.tsx          ← token, user, login(), logout()
│   └── CartContext.tsx          ← items, total, addItem(), removeItem(), clearCart()
│
├── pages/
│   ├── public/
│   │   ├── Home.tsx             ← Hero + productos destacados
│   │   ├── ProductList.tsx      ← Grilla de productos con filtro por categoría
│   │   ├── ProductDetail.tsx    ← Detalle, galería, botón "Agregar al carrito"
│   │   ├── Login.tsx            ← Formulario email + password
│   │   └── Register.tsx         ← Formulario name + email + password
│   │
│   └── private/
│       ├── user/
│       │   ├── Cart.tsx         ← Lista de ítems, cantidades, total y botón "Comprar"
│       │   ├── Checkout.tsx     ← Resumen + botón confirmar que crea la orden
│       │   └── OrderHistory.tsx ← Lista de órdenes del usuario con su estado
│       │
│       └── admin/
│           ├── Dashboard.tsx        ← Contadores: productos, categorías, órdenes
│           ├── ProductManager.tsx   ← Tabla CRUD de productos
│           ├── CategoryManager.tsx  ← Tabla CRUD de categorías
│           └── OrderManager.tsx     ← Tabla de órdenes con cambio de estado
│
├── types/
│   ├── auth.ts        ← LoginRequest, RegisterRequest, AuthResponse
│   ├── product.ts     ← Product, ProductRequest
│   ├── category.ts    ← Category, CategoryRequest
│   ├── cart.ts        ← CartItem, CartItemRequest
│   └── order.ts       ← Order, OrderItem, OrderStatus
│
└── utils/
    ├── formatCurrency.ts   ← formatCurrency(1234.5) → "$ 1,234.50"
    └── decodeToken.ts      ← Extrae email y rol del payload JWT
```

---

## Interfaces TypeScript

```typescript
// types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: Category;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

// types/order.ts
export type OrderStatus = 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// types/auth.ts
export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}
```

---

## Axios — instancia con interceptor JWT

```typescript
// api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

```typescript
// api/productApi.ts
import api from './axiosInstance';
import { Product, ProductRequest } from '../types/product';

export const getAll = () => api.get<Product[]>('/products').then(r => r.data);
export const getById = (id: number) => api.get<Product>(`/products/${id}`).then(r => r.data);
export const create = (data: ProductRequest) => api.post<Product>('/products', data).then(r => r.data);
export const update = (id: number, data: ProductRequest) => api.put<Product>(`/products/${id}`, data).then(r => r.data);
export const remove = (id: number) => api.delete(`/products/${id}`);
```

---

## Context API

### AuthContext

```typescript
// context/AuthContext.tsx
interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setUser(response);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### CartContext

```typescript
// context/CartContext.tsx
interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}
```

---

## Enrutamiento — `App.tsx`

```tsx
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas de usuario autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<OrderHistory />} />
            </Route>

            {/* Rutas de administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManager />} />
              <Route path="/admin/categories" element={<CategoryManager />} />
              <Route path="/admin/orders" element={<OrderManager />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
```

---

## Rutas protegidas

```typescript
// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// components/AdminRoute.tsx
export const AdminRoute = () => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return <Outlet />;
};
```

---

## Páginas — descripción

### Públicas

| Página          | Componentes usados                          | Llama a              |
|-----------------|---------------------------------------------|----------------------|
| `Home`          | Navbar, ProductCard (x4 destacados)         | `productApi.getAll`  |
| `ProductList`   | Grid de ProductCard, filtro por categoría   | `productApi.getAll`, `categoryApi.getAll` |
| `ProductDetail` | Imagen, descripción, cantidad, botón carrito| `productApi.getById` |
| `Login`         | Formulario, enlace a Register               | `authApi.login`      |
| `Register`      | Formulario, enlace a Login                  | `authApi.register`   |

### Usuario autenticado

| Página          | Descripción                                            |
|-----------------|--------------------------------------------------------|
| `Cart`          | Lista de ítems con imagen, nombre, cantidad y subtotal. Botón "Proceder al pago" |
| `Checkout`      | Resumen del pedido, total final, botón "Confirmar compra" que llama a `orderApi.createOrder` |
| `OrderHistory`  | Lista de órdenes con fecha, total y badge de estado    |

### Admin

| Página              | Descripción                                                        |
|---------------------|--------------------------------------------------------------------|
| `Dashboard`         | Cards con conteo de productos, categorías y órdenes pendientes     |
| `ProductManager`    | Tabla con nombre, precio, stock, categoría. Botones editar/eliminar. Modal para crear/editar |
| `CategoryManager`   | Tabla de categorías. Modal para crear/editar                       |
| `OrderManager`      | Tabla con cliente, fecha, total, estado. Select para cambiar estado |

---

## TailwindCSS — ejemplos de uso

```tsx
// ProductCard.tsx
<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
  <img className="w-full h-48 object-cover rounded-lg mb-3" src={product.imageUrl} />
  <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
  <p className="text-primary font-bold text-xl mt-1">$ {product.price}</p>
  <button className="mt-3 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors">
    Agregar al carrito
  </button>
</div>

// Badge.tsx para estado de orden
const colors = {
  PENDIENTE:  'bg-yellow-100 text-yellow-800',
  ENVIADO:    'bg-blue-100 text-blue-800',
  ENTREGADO:  'bg-green-100 text-green-800',
  CANCELADO:  'bg-red-100 text-red-800',
};

<span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
  {status}
</span>
```

---

## Páginas por módulo del curso

| Módulo | Qué construyen                                          |
|--------|---------------------------------------------------------|
| 7      | Scaffolding Vite + TS + TailwindCSS. Navbar y página Home |
| 8      | Interfaces TypeScript. Página `ProductList` con datos mock |
| 9      | Diseño responsivo. `ProductCard`, layout grid, `ProductDetail` |
| 10     | `AuthContext`, `CartContext`, `axiosInstance`. Páginas Login/Register |
| 11     | `ProtectedRoute`, `AdminRoute`, navegación completa     |
| 12     | `Cart`, `Checkout`, `OrderHistory`, panel Admin completo |

---

## Temas académicos cubiertos en el frontend

| Tema                   | Dónde se aplica                                           |
|------------------------|-----------------------------------------------------------|
| Componentes funcionales| Todos los archivos en `components/` y `pages/`           |
| Props con TypeScript   | `ProductCard`, `Badge`, `Button`, `Modal`                 |
| `useState`             | Formularios, listas, estados de carga                     |
| `useEffect`            | Carga de datos al montar componentes                      |
| `useContext`           | `useAuth()` y `useCart()` en componentes y páginas        |
| Context API            | `AuthContext`, `CartContext`                              |
| React Router v6        | `<Routes>`, `<Route>`, `useNavigate`, `useParams`         |
| `Outlet` + rutas anidadas | `ProtectedRoute`, `AdminRoute`                        |
| Axios + interceptores  | `axiosInstance.ts` adjunta el JWT automáticamente         |
| Variables de entorno   | `VITE_API_URL` en `.env`                                  |
| TailwindCSS utilitario | Estilos en todos los componentes                          |
| Tipado de API          | `types/` con interfaces para cada entidad del backend     |
