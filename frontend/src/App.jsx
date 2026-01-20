import { useState } from "react";
import { FlightProvider } from "./context/FlightContext";
import SearchForm from "./components/SearchForm/SearchForm";
import { useFlightSearch } from "./hooks/useFlightSearch";
import "./App.css";

function AppContent() {
  const { flights, loading, error, performSearch } = useFlightSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchParams) => {
    setHasSearched(true);
    await performSearch(searchParams);
  };

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
              {loading && (
                <p className="loading-text">Searching for flights...</p>
              )}

              {error && (
                <div className="error-box">
                  <p>❌ {error}</p>
                </div>
              )}

              {!loading && !error && flights.length === 0 && (
                <p className="no-results">
                  No flights found. Try adjusting your search.
                </p>
              )}

              {!loading && flights.length > 0 && (
                <div>
                  <h2 className="results-title">
                    Found {flights.length} flight
                    {flights.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="results-placeholder">
                    Flight list component coming next...
                  </p>
                </div>
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
