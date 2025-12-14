import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CartIcon from "./CartIcon";
import { logoutUser } from "../../redux/slice/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left */}
      <Link to="/" className="navbar-logo">
            Sweet Management
      </Link>

      {/* Center */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search sweets..."
        />
      </div>

      {/* Right */}
      <div className="navbar-actions">
        <CartIcon />

        {!user ? (
          <Link to="/auth" className="auth-link">
            Login / Sign Up
          </Link>
        ) : (
          <div className="user-menu">
            <span className="user-icon">👤</span>

            <div className="dropdown">
              <button onClick={() => navigate("/orders")}>
                My Orders
              </button>

              {user.role === "admin" && (
                <button onClick={() => navigate("/admin/sweets")}>
                  Sweet Management
                </button>
              )}

              <button className="logout" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
