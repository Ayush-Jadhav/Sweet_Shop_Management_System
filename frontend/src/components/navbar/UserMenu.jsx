import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/slice/authSlice";
import { logoutService } from "../../services/auth/authServices";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutService();
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="user-menu">
      <div className="user-avatar">
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>

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
    </div>
  );
};

export default UserMenu;
