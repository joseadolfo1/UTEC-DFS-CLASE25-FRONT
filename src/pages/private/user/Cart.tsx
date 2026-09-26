import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Button } from "../../../components/Button";

export function Cart() {
  const { items, total, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-xl mb-6">Tu carrito está vacío</p>
        <Button onClick={() => navigate("/products")}>Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi carrito</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
          >
            <img
              src={
                item.productImageUrl || "https://placehold.co/80x80?text=img"
              }
              alt={item.productName}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {item.productName}
              </h3>
              <p className="text-gray-500 text-sm">
                {formatCurrency(item.productPrice)} c/u
              </p>
              <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                {formatCurrency(item.subtotal)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 text-sm mt-1"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg text-gray-700">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
        <Button
          onClick={() => navigate("/checkout")}
          className="w-full py-3 text-lg"
        >
          Proceder al pago
        </Button>
      </div>
    </div>
  );
}
