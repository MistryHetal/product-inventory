import axiosInstance from "../api/apiInstance";

export const getCategories = () => axiosInstance.get("/categories");

export const getCategoryById = (id) => axiosInstance.get(`/categories/${id}`);

export const createCategory = (data) => axiosInstance.post("/categories", data);

export const updateCategory = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data);
