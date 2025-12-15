import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import CartIcon from "./CartIcon";
import { setSearchQuery } from "../../redux/slice/searchSlice";
import { logout } from "../../Services/auth/authService";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { query } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const logoutHandler = () => {
    dispatch(logout(navigate));
    setOpen(false);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Sweet Management
      </Link>

      {/* Search */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search sweets by name or category..."
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <CartIcon />

        {!user ? (
          <Link to="/auth" className="auth-link">
            Login / Sign Up
          </Link>
        ) : (
          <div className="user-menu" ref={menuRef}>
            <span
              className="user-icon"
              onClick={() => setOpen((prev) => !prev)}
            >
              👤
            </span>

            {open && (
              <div className="dropdown">
                <button
                  onClick={() => {
                    navigate("/orders");
                    setOpen(false);
                  }}
                >
                  My Orders
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin/sweets");
                      setOpen(false);
                    }}
                  >
                    Sweet Management
                  </button>
                )}

                <button className="logout" onClick={logoutHandler}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
