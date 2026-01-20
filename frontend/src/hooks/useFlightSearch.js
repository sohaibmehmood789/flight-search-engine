import { useState, useCallback } from "react";
import { searchFlights, getPriceHistory } from "../services/api";

export const useFlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Search flights
      const flightResults = await searchFlights(searchParams);
      setFlights(flightResults.data || []);

      // Fetch price history
      if (
        searchParams.origin &&
        searchParams.destination &&
        searchParams.departureDate
      ) {
        try {
          const priceResults = await getPriceHistory(
            searchParams.origin,
            searchParams.destination,
            searchParams.departureDate,
          );
          setPriceData(priceResults.data || null);
        } catch (priceError) {
          console.warn("Price history not available:", priceError);
          setPriceData(null);
        }
      }

      return { success: true, count: flightResults.count };
    } catch (err) {
      setError(err.message);
      setFlights([]);
      setPriceData(null);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setFlights([]);
    setPriceData(null);
    setError(null);
  }, []);

  return {
    flights,
    priceData,
    loading,
    error,
    performSearch,
    clearResults,
  };
};
