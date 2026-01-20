import { useState, useMemo } from "react";
import FlightCard from "./FlightCard";
import LoadingSkeleton from "./LoadingSkeleton";
import "./FlightList.css";

const FlightList = ({ flights, loading }) => {
  const [sortBy, setSortBy] = useState("best");

  const sortedFlights = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    const flightsCopy = [...flights];

    switch (sortBy) {
      case "cheapest":
        return flightsCopy.sort(
          (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
        );

      case "fastest":
        return flightsCopy.sort((a, b) => {
          const getDuration = (flight) => {
            const duration = flight.itineraries[0].duration;
            // Convert PT2H30M format to minutes
            const hours = duration.match(/(\d+)H/);
            const minutes = duration.match(/(\d+)M/);
            return (
              (hours ? parseInt(hours[1]) * 60 : 0) +
              (minutes ? parseInt(minutes[1]) : 0)
            );
          };
          return getDuration(a) - getDuration(b);
        });

      case "best":
      default:
        // Best = combination of price and duration
        return flightsCopy.sort((a, b) => {
          const scoreA =
            parseFloat(a.price.total) / 100 +
            parseInt(a.itineraries[0].segments.length) * 50;
          const scoreB =
            parseFloat(b.price.total) / 100 +
            parseInt(b.itineraries[0].segments.length) * 50;
          return scoreA - scoreB;
        });
    }
  }, [flights, sortBy]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✈️</div>
        <h3>No flights found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="flight-list">
      {/* Sort Controls */}
      <div className="flight-list-header">
        <h2 className="results-count">
          {flights.length} flight{flights.length !== 1 ? "s" : ""} found
        </h2>
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <button
            className={`sort-button ${sortBy === "best" ? "active" : ""}`}
            onClick={() => setSortBy("best")}
          >
            Best
          </button>
          <button
            className={`sort-button ${sortBy === "cheapest" ? "active" : ""}`}
            onClick={() => setSortBy("cheapest")}
          >
            Cheapest
          </button>
          <button
            className={`sort-button ${sortBy === "fastest" ? "active" : ""}`}
            onClick={() => setSortBy("fastest")}
          >
            Fastest
          </button>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="flight-cards">
        {sortedFlights.map((flight, index) => (
          <FlightCard key={`${flight.id || index}`} flight={flight} />
        ))}
      </div>
    </div>
  );
};

export default FlightList;
