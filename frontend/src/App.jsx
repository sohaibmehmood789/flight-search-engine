import { useState } from "react";
import { FlightProvider } from "./context/FlightContext";
import SearchForm from "./components/SearchForm/SearchForm";
import FlightList from "./components/FlightList/FlightList";
import PriceGraph from "./components/PriceGraph/PriceGraph";
import { useFlightSearch } from "./hooks/useFlightSearch";
import "./App.css";

function AppContent() {
  const { flights, priceData, loading, error, performSearch } =
    useFlightSearch();
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
              {error && (
                <div className="error-box">
                  <p>❌ {error}</p>
                </div>
              )}

              {!error && (
                <>
                  <PriceGraph priceHistory={priceData} loading={loading} />
                  <FlightList flights={flights} loading={loading} />
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
