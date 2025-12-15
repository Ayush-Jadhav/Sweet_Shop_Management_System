import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import "./sweetCard.css";

const SweetCard = ({ sweet }) => {
  const dispatch = useDispatch();

  const outOfStock = sweet.quantity === 0;

  return (
    <div className="sweet-card">
      <div className="sweet-image-wrapper">
        <img src={sweet.image} alt={sweet.name} className="sweet-image" />

        {outOfStock && <span className="stock-badge">Out of Stock</span>}
      </div>

      <div className="sweet-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <p className="sweet-category">{sweet.category}</p>

        <div className="sweet-footer">
          <span className="sweet-price">₹{sweet.price}</span>

          <button
            disabled={outOfStock}
            onClick={() => dispatch(addToCart(sweet))}
            className={`add-to-cart-btn ${
              outOfStock ? "add-to-cart-btn--disabled" : ""
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
