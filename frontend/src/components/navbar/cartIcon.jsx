import { useSelector } from "react-redux";
import { useState } from "react";
import CartSidebar from "../cart/CartSidebar";
import "./CartIcon.css";

const CartIcon = () => {
  const { items } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="cart-icon"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        🛒
        {items.length > 0 && (
          <span className="cart-badge">
            {items.length}
          </span>
        )}
      </div>

      <CartSidebar isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CartIcon;
