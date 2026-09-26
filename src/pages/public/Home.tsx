import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { ProductCard } from "../../components/ProductCard";
import * as productApi from "../../api/productApi";

export function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    productApi.getAll().then((products) => setFeatured(products.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenido a ShopEasy</h1>
          <p className="text-xl mb-8 opacity-90">
            Encuentra los mejores productos al mejor precio
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Ver catálogo
          </button>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Productos destacados
        </h2>
        {featured.length === 0 ? (
          <p className="text-gray-400">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/products")}
            className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      </section>
    </div>
  );
}
