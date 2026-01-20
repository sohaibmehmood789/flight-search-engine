import { useState, useCallback } from "react";
import { FlightProvider } from "./context/FlightContext";
import SearchForm from "./components/SearchForm/SearchForm";
import FlightList from "./components/FlightList/FlightList";
import PriceGraph from "./components/PriceGraph/PriceGraph";
import FilterPanel from "./components/Filters/FilterPanel";
import { useFlightSearch } from "./hooks/useFlightSearch";
import "./App.css";

function AppContent() {
  const { flights, priceData, loading, error, performSearch } =
    useFlightSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const handleSearch = async (searchParams) => {
    setHasSearched(true);
    await performSearch(searchParams);
  };

  const applyFilters = useCallback(
    (filters) => {
      if (!flights || flights.length === 0) {
        setFilteredFlights([]);
        return;
      }

      let filtered = [...flights];

      // Price range filter
      filtered = filtered.filter((flight) => {
        const price = parseFloat(flight.price.total);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      // Stops filter
      if (filters.stops.length > 0) {
        filtered = filtered.filter((flight) => {
          const stops = flight.itineraries[0].segments.length - 1;
          return filters.stops.some((filterStop) => {
            if (filterStop === 2) return stops >= 2;
            return stops === filterStop;
          });
        });
      }

      // Airlines filter
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight) =>
          flight.validatingAirlineCodes?.some((code) =>
            filters.airlines.includes(code),
          ),
        );
      }

      // Departure time filter
      if (filters.departureTime !== "any") {
        filtered = filtered.filter((flight) => {
          const departureTime = new Date(
            flight.itineraries[0].segments[0].departure.at,
          );
          const hours = departureTime.getHours();

          switch (filters.departureTime) {
            case "morning":
              return hours >= 6 && hours < 12;
            case "afternoon":
              return hours >= 12 && hours < 18;
            case "evening":
              return hours >= 18 && hours < 24;
            case "night":
              return hours >= 0 && hours < 6;
            default:
              return true;
          }
        });
      }

      setFilteredFlights(filtered);
    },
    [flights],
  );

  const displayFlights =
    filteredFlights.length > 0 || !hasSearched ? filteredFlights : flights;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">✈️ Flight Search</h1>
          <p className="app-subtitle">Find the best deals on flights</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Search Form */}
          <div className="search-section">
            <SearchForm onSearch={handleSearch} loading={loading} />
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="results-section">
              {error && (
                <div className="error-box">
                  <p>❌ {error}</p>
                </div>
              )}

              {!error && (
                <>
                  <PriceGraph priceHistory={priceData} loading={loading} />
                  <div className="results-content">
                    <aside className="filters-sidebar">
                      <FilterPanel
                        flights={flights}
                        onFilterChange={applyFilters}
                      />
                    </aside>
                    <div className="flights-main">
                      <FlightList flights={displayFlights} loading={loading} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <FlightProvider>
      <AppContent />
    </FlightProvider>
  );
}

export default App;
