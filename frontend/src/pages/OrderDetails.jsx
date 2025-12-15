import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetailsService } from "../Services/order/orderManagement";
import "./OrderDetails.css";

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
    <div className="order-details-page">
      <div className="order-details-container">
        <h2 className="order-details-title">
          Order #{order.orderId}
        </h2>

        <div className="order-summary">
          <p>
            <strong>Status:</strong>{" "}
            <span className={`order-status ${order.status}`}>
              {order.status}
            </span>
          </p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <h3 className="order-items-title">Items</h3>

        {order.items.map(item => (
          <div key={item._id} className="order-item">
            <span className="order-item-name">{item.sweetId?.name}</span>
            <span className="order-item-price">
              {item.quantity} × ₹{item.price}
            </span>
          </div>
        ))}
      </div>
    </div>

  );
};

export default OrderDetails;
