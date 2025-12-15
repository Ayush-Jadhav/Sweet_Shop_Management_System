import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrdersService } from "../Services/order/orderManagement";
import("./OrderHistory.css");

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
    return (
      <div className="order-history-loading-state">
        <p>Retrieving your recent sweet orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-empty-state">
        <p>You haven't placed any delicious orders yet.</p>
        <button className="empty-state-btn" onClick={() => navigate("/")}>
          Browse Sweets
        </button>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <h2 className="order-history-title">Your Order History</h2>

      <div className="order-history-list">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="order-card"
            onClick={() => navigate(`/orders/${order.orderId}`)}
          >
            {/* LEFT */}
            <div className="order-info">
              <p className="order-id">
                Order <span className="order-id__number">#{order.orderId}</span>
              </p>
              {/* Highlight total amount */}
              <p className="order-amount">
                Total:{" "}
                <span className="order-amount__value">
                  ₹{order.totalAmount}
                </span>
              </p>
              {/* REMOVED order-date from here */}
            </div>

            {/* RIGHT (Status and Date) */}
            <div className="order-status-group">
              <div
                className={`order-status-badge order-status-badge--${order.status.toLowerCase()}`}
              >
                {order.status}
              </div>
              {/* NEW LOCATION FOR DATE */}
              <p className="order-date">
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
