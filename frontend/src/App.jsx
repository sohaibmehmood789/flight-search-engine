import { FlightProvider } from "./context/FlightContext";
import "./App.css";

function App() {
  return (
    <FlightProvider>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1 className="app-title">✈️ Flight Search</h1>
            <p className="app-subtitle">Find the best deals on flights</p>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            {/* Search Form will go here */}
            <div className="search-section">
              <p>Search form coming soon...</p>
            </div>

            {/* Results will go here */}
            <div className="results-section">
              <p>Flight results will appear here...</p>
            </div>
          </div>
        </main>
      </div>
    </FlightProvider>
  );
}

export default App;
