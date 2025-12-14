import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  signupData: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    clearSignupData(state) {
      state.signupData = null;
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setUser,
  logoutUser,
  setSignupData,
  clearSignupData,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
