import { apiConnector } from "../../api/apiConnector";
import { AUTH_ENDPOINTS } from "../apiEndpoints";
import {
  setUser,
  logoutUser,
  setAuthLoading,
} from "../../redux/slice/authSlice";
import { clearCart } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";

/* ======================
   LOGIN
====================== */
export const logIn = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    const response = await apiConnector("POST", AUTH_ENDPOINTS.LOGIN, formData);

    dispatch(setUser(response.user));
    toast.success("Login successful");

    navigate("/");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/* ======================
   SEND OTP
====================== */
export const sendOTP = (email, number, navigate) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    await apiConnector("POST", AUTH_ENDPOINTS.SEND_OTP, {
      email,
      number,
    });

    toast.success("OTP sent to your email");
    navigate("/verify-otp");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to send OTP");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/* ======================
   SIGNUP (AFTER OTP VERIFY)
====================== */
export const signUp = (signupData, navigate) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    const response = await apiConnector(
      "POST",
      AUTH_ENDPOINTS.SIGNUP,
      signupData
    );

    dispatch(setUser(response.user));
    toast.success("Signup successful");

    navigate("/");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/* ======================
   LOGOUT
====================== */
export const logout = (navigate) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    await apiConnector("POST", AUTH_ENDPOINTS.LOGOUT);

    dispatch(logoutUser());
    dispatch(clearCart());

    toast.success("Logged out successfully");
    navigate("/auth");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout failed");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/* ======================
   GET CURRENT USER (COOKIE BASED)
====================== */
export const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    const response = await apiConnector("GET", AUTH_ENDPOINTS.GET_CURRENT_USER);

    dispatch(setUser(response.user));
  } catch (error) {
    // Silent fail → user not logged in
    dispatch(logoutUser());
  } finally {
    dispatch(setAuthLoading(false));
  }
};
