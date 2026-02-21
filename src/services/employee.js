import api from "./config/axiosConfig";

export const getAllEmployee = (params) => api.get("/employees",{params})