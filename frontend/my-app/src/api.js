// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://togglenest-ga5e.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const generateAITasks = async (description) => {
  const response = await api.post("/ai/generate-tasks", { description });
  return response.data;
};


export default api;
