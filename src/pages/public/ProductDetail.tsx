import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import * as productApi from "../../api/productApi";
import { Button } from "../../components/Button";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    if (id) productApi.getById(Number(id)).then(setProduct);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    await addItem(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product)
    return <p className="text-center py-20 text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-primary mb-6 hover:underline"
      >
        ← Volver
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={
            product.imageUrl || "https://placehold.co/600x400?text=Sin+imagen"
          }
          alt={product.name}
          className="w-full rounded-xl object-cover"
        />

        <div>
          <p className="text-sm text-primary font-medium mb-2">
            {product.categoryName}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-4xl font-bold text-primary mb-4">
            {formatCurrency(product.price)}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Sin stock"}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Cantidad:</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
              >
                −
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-3 text-lg"
          >
            {added
              ? "✓ Agregado"
              : product.stock > 0
                ? "Agregar al carrito"
                : "Sin stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
