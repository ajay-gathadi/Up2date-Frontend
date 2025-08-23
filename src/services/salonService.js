import apiClient from "../api/apiClient";

/**
 * Fetches the list of all the services provided by the salon.
 * @returns {Promise<any>}
 */
export const getSalonServices = async () => {
    const response = await apiClient.get("/services");
    return response.data;
}