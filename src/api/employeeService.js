import apiClient from "./apiClient";

export const getEmployees = () => {
    return apiClient.get('/employees');
};