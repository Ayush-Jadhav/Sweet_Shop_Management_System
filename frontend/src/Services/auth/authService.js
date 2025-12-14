import { apiConnector } from "../../api/apiConnector";
import { AUTH_ENDPOINTS } from "../apiEndpoints";
import { setUser, logoutUser, setAuthLoading } from "../../redux/slice/authSlice";
import { clearCart } from "../../redux/slice/cartSlice";


/* ======================
   LOGIN
====================== */
export const logIn = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));

    const response = await apiConnector(
      "POST",
      AUTH_ENDPOINTS.LOGIN,
      formData
    );

    // backend sends userInfo
    dispatch(setUser(response.user));

    navigate("/");
  } catch (error) {
    alert(error?.response?.message || "Login failed");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/* ======================
   SEND OTP
====================== */
export const sendOTP = (email, number, navigate) => async () => {
  try {
    await apiConnector("POST", AUTH_ENDPOINTS.SEND_OTP, {
      email,
      number,
    });

    navigate("/verify-otp");
  } catch (error) {
    alert(error?.response?.data?.message || "Failed to send OTP");
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

    dispatch(setUser(response.data.user));
    navigate("/");
  } catch (error) {
    alert(error?.response?.data?.message || "Signup failed");
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

    navigate("/login");
  } catch (error) {
    console.error("Logout failed", error);
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

    const response = await apiConnector(
      "GET",
      AUTH_ENDPOINTS.GET_CURRENT_USER
    );

    dispatch(setUser(response.data.user));
  } catch (error) {
    // Silent fail → user not logged in
    dispatch(logoutUser());
  } finally {
    dispatch(setAuthLoading(false));
  }
};
