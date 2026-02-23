import api from "./config/axiosConfig";

export const getAllEmployee = (params) => api.get("/employees", { params });
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post(`/employees/`, data);
export const deleteEmployeeById = (id) => api.delete(`/employees/${id}`);