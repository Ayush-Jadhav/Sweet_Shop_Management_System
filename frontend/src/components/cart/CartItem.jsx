import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/slice/cartSlice";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      {/* Left (Image and Info) */}
      <div className="cart-item__details-group">
        {/* Image Container */}
        <div className="cart-item-image-wrapper">
          <img src={item.image} alt={item.name} className="cart-item-image" />
        </div>

        {/* Item Info */}
        <div className="cart-item-info">
          <h4 className="cart-item-name">{item.name}</h4>
          <p className="cart-item-price">
            ₹{item.price} x {item.quantity} ={" "}
            <span className="cart-item-line-total">₹{lineTotal}</span>
          </p>
        </div>
      </div>

      {/* Right (Actions) */}
      <div className="cart-item-actions">
        <button
          className="qty-btn qty-btn--minus"
          onClick={() => dispatch(removeFromCart(item._id))}
        >
          −
        </button>

        <span className="qty">{item.quantity}</span>

        <button
          className="qty-btn qty-btn--plus"
          onClick={() => dispatch(addToCart(item))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
