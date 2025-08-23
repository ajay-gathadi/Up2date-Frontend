import apiClient from "../api/apiClient";

export const getEmployees = async (status) => {
    const params = status ? {status} : {};
    const response = await apiClient.get(`/employees`, {params});
    return response.data;
};

export const addEmployee = async (employeeData) => {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
};

export const updateEmployee = async (employeeId, employeeData) => {
    const response = await apiClient.put(`/employees/${employeeId}`, employeeData);
    return response.data;
};

export const deleteEmployee = async (employeeId) => {
    const response = await apiClient.delete(`/employees/${employeeId}`);
    return response.data;
}