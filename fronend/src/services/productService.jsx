import axiosInstance from "../api/apiInstance";

export const getProducts = (params) =>
  axiosInstance.get("/products", { params });

export const getProductById = (id) => axiosInstance.get(`/products/${id}`);

export const createProduct = (data) => axiosInstance.post("/products", data);

export const updateProduct = (id, data) =>
  axiosInstance.put(`/products/${id}`, data);
