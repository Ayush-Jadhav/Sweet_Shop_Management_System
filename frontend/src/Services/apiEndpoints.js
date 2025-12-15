const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ===========================
   AUTH ENDPOINTS
=========================== */
export const AUTH_ENDPOINTS = {
  SEND_OTP: `${BASE_URL}/auth/emailVerify`,
  SIGNUP: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
  GET_CURRENT_USER: `${BASE_URL}/auth/findUser`,
};

/* ===========================
  INVENTORY (SWEET) MANAGEMENT ENDPOINTS (ADMIN ONLY)
=========================== */
export const INVENTORY_MANAGEMENT_ENDPOINTS = {
  CREATE_SWEET: `${BASE_URL}/sweets`,
  UPDATE_SWEET: `${BASE_URL}/sweets`, // /:id
  DELETE_SWEET: `${BASE_URL}/sweets`, // /:id
};

/* ===========================
  PRODUCT (SWEET) FETCHING ENDPOINTS
=========================== */
export const GET_SWEET_ENDPOINTS = {
  GET_ALL_SWEETS: `${BASE_URL}/sweets`,
  SEARCH_SWEETS: `${BASE_URL}/sweets/search`,
  GET_SWEETS_BY_PAGE: `${BASE_URL}/sweets/page`, // /:pageNumber
};


/* ===========================
  ORDER MANAGEMENT ENDPOINTS
=========================== */
export const ORDER_ENDPOINTS = {
  PURCHASE_SWEET: `${BASE_URL}/sweets/purchase`, // /:id/purchase
  ORDER_DETAILS: `${BASE_URL}/orders`, // /:id
  MY_ORDER: `${BASE_URL}/orders/me`
};

