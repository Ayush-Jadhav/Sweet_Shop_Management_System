import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
} from "../../redux/slice/cartSlice";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="cart-item">
      {/* Left */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">₹{item.price}</p>
      </div>

      {/* Right */}
      <div className="cart-item-actions">
        <button
          className="qty-btn"
          onClick={() => dispatch(removeFromCart(item._id))}
        >
          −
        </button>

        <span className="qty">{item.quantity}</span>

        <button
          className="qty-btn"
          onClick={() =>
            dispatch(
              addToCart({
                sweetId: item._id,
                name: item.name,
                price: item.price,
              })
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
