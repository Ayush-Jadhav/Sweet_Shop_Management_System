import axios from "axios";
import { AUTH_ENDPOINTS } from "../Services/apiEndpoints";

/* ===========================
   Axios Instance
=========================== */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ===========================
   Refresh Token Handling
=========================== */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else resolve(axiosInstance(config));
  });
  failedQueue = [];
};

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Only handle expired access token
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post(
          AUTH_ENDPOINTS.REFRESH_TOKEN,
          {},
          { withCredentials: true }
        );

        processQueue();
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ===========================
   Generic API Connector
=========================== */
export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    throw (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
