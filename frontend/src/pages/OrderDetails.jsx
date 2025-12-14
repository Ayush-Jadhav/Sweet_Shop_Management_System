import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetailsService } from "../Services/order/orderManagement";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await getOrderDetailsService(orderId);
      setOrder(res.order);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Order #{order.orderId}
      </h2>

      <div className="border rounded p-4 mb-4">
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Items</h3>

      <div className="space-y-2">
        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border p-3 rounded"
          >
            <span>{item.sweetId?.name}</span>
            <span>
              {item.quantity} × ₹{item.sweetId?.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
