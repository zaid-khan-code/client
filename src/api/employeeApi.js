import API from "./axiosInstance";

// Employee Info CRUD
export const getEmployees = (params) => API.get("/employees", { params });
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post("/employees", data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// Extra Employee Info CRUD
export const getExtraEmployees = (params) => API.get("/extra-employees", { params });
export const getExtraEmployeeById = (id) => API.get(`/extra-employees/${id}`);
export const createExtraEmployee = (data) => API.post("/extra-employees", data);
export const updateExtraEmployee = (id, data) => API.put(`/extra-employees/${id}`, data);
export const deleteExtraEmployee = (id) => API.delete(`/extra-employees/${id}`);
