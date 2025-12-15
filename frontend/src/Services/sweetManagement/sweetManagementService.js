import { apiConnector } from "../../api/apiConnector";
import { GET_SWEET_ENDPOINTS , INVENTORY_MANAGEMENT_ENDPOINTS} from "../apiEndpoints";

/* =====================================
   SWEET MANAGEMENT SERVICES
===================================== */

/**
 * Create a new sweet (Admin)
 * @param {FormData} formData
 */
export const createSweetService = (formData) => {
  return apiConnector(
    "POST",
    INVENTORY_MANAGEMENT_ENDPOINTS.CREATE_SWEET,
    formData,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};


/**
 * Update an existing sweet (Admin)
 * @param {string} sweetId
 * @param {FormData} formData
 */
export const updateSweetService = (sweetId, formData) => {
  return apiConnector(
    "PUT",
    `${INVENTORY_MANAGEMENT_ENDPOINTS.UPDATE_SWEET}/${sweetId}`,
    formData,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};


/**
 * Delete a sweet (Admin)
 * @param {string} sweetId
 */
export const deleteSweetService = (sweetId) => {
  return apiConnector(
    "DELETE",
    `${INVENTORY_MANAGEMENT_ENDPOINTS.DELETE_SWEET}/${sweetId}`
  );
};


/**
 * Fetch sweets by page (Public / Protected)
 * @param {number} pageNumber
 */
export const fetchSweetsByPageService = (pageNumber) => {
  return apiConnector(
    "GET",
    `${GET_SWEET_ENDPOINTS.GET_SWEETS_BY_PAGE}/${pageNumber}`
  );
};


/**
 * Fetch all sweets 
 */
export const fetchAllSweetsService = () => {
  return apiConnector(
    "GET",
    GET_SWEET_ENDPOINTS.GET_ALL_SWEETS
  );
};

/**
 * Search sweets by name, category, price range
 * @param {Object} queryParams
 * Example: { name, category, minPrice, maxPrice }
 */
export const searchSweetsService = (queryParams) => {
  return apiConnector(
    "GET",
    GET_SWEET_ENDPOINTS.SEARCH_SWEETS,
    null,
    {},
    queryParams
  );
};

