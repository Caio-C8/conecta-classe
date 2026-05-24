import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const urlRequisicao = error.config?.url || "";
    const urlLogin = urlRequisicao.includes("autenticacao/login");

    if (error.response?.status === 401) {
      Cookies.remove("token");

      if (typeof window !== "undefined" && !urlLogin) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
