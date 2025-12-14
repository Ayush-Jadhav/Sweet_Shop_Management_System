import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import OrderHistory from "../pages/OrderHistory";
import OrderDetails from "../pages/OrderDetails";
import AdminSweetManagement from "../pages/admin/AdminSweetManagement";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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

      <Route
        path="/admin/sweets"
        element={
          <AdminRoute>
            <AdminSweetManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
