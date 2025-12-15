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
   <div className="order-history-page">
  <h2 className="order-history-title">My Orders</h2>

  <div className="order-history-list">
    {orders.map((order) => (
      <div
        key={order.orderId}
        className="order-card"
        onClick={() => navigate(`/orders/${order.orderId}`)}
      >
        {/* LEFT */}
        <div className="order-info">
          <p className="order-id">Order #{order.orderId}</p>
          <p className="order-amount">₹{order.totalAmount}</p>
          <p className="order-date">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* RIGHT */}
        <div className={`order-status ${order.status}`}>
          {order.status}
        </div>
      </div>
    ))}
  </div>
</div>


  );
};

export default OrderHistory;
