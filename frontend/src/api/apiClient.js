import api from "./axios";
import { AUTH_ENDPOINTS } from "../Services/apiEndpoints";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject, request }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(request));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // Network / CORS / server down
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Only refresh for expired access token
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      // If refresh already running → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            request: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post(
          AUTH_ENDPOINTS.REFRESH_TOKEN,
          {},
          { withCredentials: true }
        );

        processQueue();
        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        // Prevent redirect loop
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
