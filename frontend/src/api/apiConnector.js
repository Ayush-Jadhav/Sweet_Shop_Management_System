import axios from "axios";

/* ===========================
   Axios Instance
=========================== */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:4000/api
  withCredentials: true, 
});

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
    // Centralized error handling
    throw (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
