/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const FlightContext = createContext();

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error("useFlightContext must be used within FlightProvider");
  }
  return context;
};

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    stops: [],
    airlines: [],
    departureTime: "any",
    maxDuration: 24,
  });

  const value = {
    flights,
    setFlights,
    filteredFlights,
    setFilteredFlights,
    priceHistory,
    setPriceHistory,
    loading,
    setLoading,
    error,
    setError,
    searchParams,
    setSearchParams,
    filters,
    setFilters,
  };

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
};
