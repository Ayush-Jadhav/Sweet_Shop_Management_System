import { apiConnector } from "../../api/apiConnector";
import { ORDER_ENDPOINTS } from "../apiEndpoints";

export const createOrderService = (items) => {
  return apiConnector(
    "POST",
    ORDER_ENDPOINTS.PURCHASE_SWEET,
    { items }
  );
};

export const getMyOrdersService = () => {
  return apiConnector(
    "GET",
    ORDER_ENDPOINTS.MY_ORDER
  );
};

export const getOrderDetailsService = (orderId) => {
  return apiConnector(
    "GET",
    `${ORDER_ENDPOINTS.ORDER_DETAILS}/${orderId}`
  );
};
