import { useEffect, useState } from "react";
import { Order } from "../../../types/order";
import { Badge } from "../../../components/Badge";
import { formatCurrency } from "../../../utils/formatCurrency";
import * as orderApi from "../../../api/orderApi";

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <p className="text-center py-20 text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">Aún no tienes pedidos.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    Pedido #{order.id}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <Badge status={order.status} />
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-gray-600">
                    {item.productName} × {item.quantity} —{" "}
                    {formatCurrency(item.subtotal)}
                  </p>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <span className="font-bold text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
