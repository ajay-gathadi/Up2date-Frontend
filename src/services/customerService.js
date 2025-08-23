import apiClient from "../api/apiClient";

const getAllCustomer = () => {
    return apiClient.get("/api/customers");
}

/**
 * Creates a new customer.
 * @param customerData - The customer data
 * @returns {Promise<any>}
 */
export const createCustomer = async (customerData) => {
    const response = await apiClient.post("/api/customer/create", customerData);
    return response.data;
}

/**
 * Create a new customer service record.
 * @param serviceData
 * @returns {Promise<any>}
 */
export const createCustomerService = async (serviceData) => {
    const response = await apiClient.post("/customer-service", serviceData);
    return response.data;
}