import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import AdminSweetManagement from "./pages/AdminSweetManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import VerifyOtp from "./components/auth/VerifyOtp";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./Services/auth/authService";
import OpenRoute from "./routes/OpenRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <OpenRoute>
              <AuthPage />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <OpenRoute>
              <VerifyOtp />
            </OpenRoute>
          }
        />

        {/* User */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/sweets"
          element={
            <ProtectedRoute adminOnly>
              <AdminSweetManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
