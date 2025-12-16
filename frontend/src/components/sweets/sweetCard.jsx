import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import "./sweetCard.css";

const SweetCard = ({ sweet }) => {
  const dispatch = useDispatch();

  const outOfStock = sweet.quantity === 0;

  const handleAddToCart = () => {
    if (outOfStock) {
      toast.warning("This item is out of stock");
      return;
    }

    dispatch(addToCart(sweet));
    toast.success(`${sweet.name} added to cart 🛒`);
  };

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
            onClick={handleAddToCart}
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
