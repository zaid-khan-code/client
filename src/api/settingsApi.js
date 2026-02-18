import API from "./axiosInstance";

// Departments
export const getDepartments = () => API.get("/departments");
export const createDepartment = (data) => API.post("/departments", data);
export const updateDepartment = (id, data) => API.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);

// Designations
export const getDesignations = () => API.get("/designations");
export const createDesignation = (data) => API.post("/designations", data);
export const updateDesignation = (id, data) => API.put(`/designations/${id}`, data);
export const deleteDesignation = (id) => API.delete(`/designations/${id}`);

// Employment Types
export const getEmploymentTypes = () => API.get("/employment-types");
export const createEmploymentType = (data) => API.post("/employment-types", data);
export const updateEmploymentType = (id, data) => API.put(`/employment-types/${id}`, data);
export const deleteEmploymentType = (id) => API.delete(`/employment-types/${id}`);

// Job Statuses
export const getJobStatuses = () => API.get("/job-statuses");
export const createJobStatus = (data) => API.post("/job-statuses", data);
export const updateJobStatus = (id, data) => API.put(`/job-statuses/${id}`, data);
export const deleteJobStatus = (id) => API.delete(`/job-statuses/${id}`);
