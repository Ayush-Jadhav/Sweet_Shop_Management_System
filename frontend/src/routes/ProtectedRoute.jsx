import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../Services/auth/authService";

/**
 * @param {ReactNode} children
 * @param {boolean} adminOnly - restrict route to admin users
 */
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  // Fetch user on page refresh / direct URL access
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // While checking auth → prevent UI flicker
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
