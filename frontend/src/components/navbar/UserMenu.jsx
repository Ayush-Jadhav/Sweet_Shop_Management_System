import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../services/auth/authServices";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./UserMenu.css";

const UserMenu = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    dispatch(logout(navigate));
    navigate("/auth");
  };

  // Close dropdown when clicking outside
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
    <div className="user-menu" ref={menuRef}>
      <div
        className="user-avatar"
        onClick={() => setOpen((prev) => !prev)}
      >
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>

      {open && (
        <div className="user-dropdown">
          <button onClick={() => navigate("/orders")}>
            Order History
          </button>

          {isAdmin && (
            <button onClick={() => navigate("/admin/sweets")}>
              Sweet Management
            </button>
          )}

          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
