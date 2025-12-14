import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrdersService } from "../Services/order/orderManagement";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrdersService();
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        You have not placed any orders yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.orderId}
            onClick={() => navigate(`/orders/${order.orderId}`)}
            className="border rounded p-4 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <span className="font-medium">
                Order #{order.orderId}
              </span>

              <span
                className={`px-2 py-1 rounded text-sm ${
                  order.status === "SUCCESSFUL"
                    ? "bg-green-100 text-green-700"
                    : order.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p>Total: ₹{order.totalAmount}</p>
              <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
