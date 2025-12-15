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
    return <p className="order-loading">Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="order-error">Order not found or an error occurred.</div>
    );
  }

  const itemSubtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        {/* --- Header & Status --- */}
        <div className="order-details-header">
          <h2 className="order-details-title">
            Order <span className="order-id-number">#{order.orderId}</span>
          </h2>
          <div
            className={`order-status-badge order-status-badge--${order.status.toLowerCase()}`}
          >
            {order.status}
          </div>
        </div>

        {/* --- Summary / Metadata --- */}
        <div className="order-summary-metadata">
          <p>
            <strong>Placed On:</strong>
            <span>
              {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <p>
            <strong>Customer:</strong>
            <span>{order.userId?.name || "Guest User"}</span>{" "}
          </p>
        </div>

        {/* --- Items List --- */}
        <h3 className="order-items-title">Items Ordered ({totalItems})</h3>

        <ul className="order-items-list">
          {order.items.map(
            (item) =>
              item.sweetId?.name && (
                <li key={item._id} className="order-item">
                  <span className="order-item-name">{item.sweetId.name}</span>
                  <span className="order-item-qty-price">
                    {item.quantity} × ₹{item.price}
                  </span>
                  <span className="order-item-line-total">
                    ₹{item.quantity * item.price}
                  </span>
                </li>
              )
          )}
        </ul>

        {/* --- Total Summary --- */}
        <div className="order-total-section">
          <div className="order-total-row">
            <span>Subtotal ({totalItems} items)</span>
            <span>₹{itemSubtotal}</span>
          </div>

          <div className="order-total-row order-total-row--final">
            <strong>Total Amount</strong>
            <strong className="final-amount-value">₹{order.totalAmount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
