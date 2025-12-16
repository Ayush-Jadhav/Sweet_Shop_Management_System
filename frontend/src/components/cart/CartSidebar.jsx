import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice";
import CartItem from "./CartItem";
import { createOrderService } from "../../Services/order/orderManagement";
import { useState } from "react";
import { toast } from "react-toastify";
import "./CartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    try {
      setLoading(true);

      const payload = items.map((item) => ({
        sweetId: item._id,
        quantity: item.quantity,
      }));

      await createOrderService(payload);

      dispatch(clearCart());
      onClose();

      toast.success(
        "Order placed successfully. Please check your email (including spam folder)."
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Items */}
        <div className="cart-body">
          {items.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            items.map((item) => <CartItem key={item._id} item={item} />)
          )}
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            disabled={loading || items.length === 0}
            onClick={handlePlaceOrder}
            className="place-order-btn"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
