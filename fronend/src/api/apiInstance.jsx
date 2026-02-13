import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
