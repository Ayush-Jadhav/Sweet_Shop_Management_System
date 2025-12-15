import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import AdminSweetManagement from "./pages/AdminSweetManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import VerifyOtp from "./components/auth/VerifyOtp";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />}/>

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
