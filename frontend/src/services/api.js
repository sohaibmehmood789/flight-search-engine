import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "An error occurred";
    console.error("[API Error]:", message);
    return Promise.reject(new Error(message));
  },
);

/**
 * Search for flights
 */
export const searchFlights = async (searchParams) => {
  return await apiClient.post("/flights/search", searchParams);
};

/**
 * Get price history for graph
 */
export const getPriceHistory = async (origin, destination, departureDate) => {
  return await apiClient.get("/flights/price-history", {
    params: { origin, destination, departureDate },
  });
};

/**
 * Health check
 */
export const healthCheck = async () => {
  return await apiClient.get("/health");
};

export default {
  searchFlights,
  getPriceHistory,
  healthCheck,
};
