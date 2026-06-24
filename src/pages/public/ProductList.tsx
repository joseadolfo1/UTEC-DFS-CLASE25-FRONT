import { useEffect, useState } from 'react'
import { Product } from '../../types/product'
import { Category } from '../../types/category'
import { ProductCard } from '../../components/ProductCard'
import * as productApi from '../../api/productApi'
import * as categoryApi from '../../api/categoryApi'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi.getAll().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    productApi.getAll(selectedCategory).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [selectedCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo de productos</h1>

      {/* Filtro de categorias */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
