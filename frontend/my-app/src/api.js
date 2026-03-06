// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://togglenest-ga5e.onrender.com",
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
  const response = await fetch("/api/ai/generate-tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ description })
  });

  return response.json();
};


export default api;
