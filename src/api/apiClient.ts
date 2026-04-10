import axios from "axios";
import config from "@/config";

export const apiClient = axios.create({
  baseURL: config.apiPath,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        return Promise.reject(new Error("Unauthorized"));
      }

      if (status === 500) {
        return Promise.reject(new Error("Server error"));
      }
    }
  }
);