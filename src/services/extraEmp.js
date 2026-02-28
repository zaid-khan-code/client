import api from "./config/axiosConfig";

export const getAllExtraEmployee = () => api.get("/extra-employees");
export const getExtraEmployeeById = (id) => api.get(`/extra-employees/${id}`);
export const createExtraEmployee = (data) => api.post(`/extra-employees`, data);
export const UpdateExtraEmployee = (data) => api.put(`/extra-employees`, data); 