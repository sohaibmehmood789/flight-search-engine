import { useState, useEffect, useMemo } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import "./FilterPanel.css";

const FilterPanel = ({ flights, onFilterChange }) => {
  // Extract unique airlines from flights
  const availableAirlines = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    const airlinesSet = new Set();
    flights.forEach((flight) => {
      if (flight.validatingAirlineCodes) {
        flight.validatingAirlineCodes.forEach((code) => airlinesSet.add(code));
      }
    });
    return Array.from(airlinesSet).sort();
  }, [flights]);

  const priceRange = useMemo(() => {
    if (!flights || flights.length === 0) return { min: 0, max: 10000 };

    const prices = flights.map((f) => parseFloat(f.price.total));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Initialize filters with price range from flights
  const [filters, setFilters] = useState({
    priceRange: [priceRange.min, priceRange.max],
    stops: [],
    airlines: [],
    departureTime: "any",
  });

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const handleStopsToggle = (stops) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter((s) => s !== stops)
      : [...filters.stops, stops];
    setFilters({ ...filters, stops: newStops });
  };

  const handleAirlineToggle = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    setFilters({ ...filters, airlines: newAirlines });
  };

  const handleReset = () => {
    setFilters({
      priceRange: [priceRange.min, priceRange.max],
      stops: [],
      airlines: [],
      departureTime: "any",
    });
  };

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.departureTime !== "any" ||
    filters.priceRange[0] !== priceRange.min ||
    filters.priceRange[1] !== priceRange.max;

  if (!flights || flights.length === 0) return null;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title">
          <AdjustmentsHorizontalIcon className="filter-icon" />
          <h3>Filters</h3>
        </div>
        {hasActiveFilters && (
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4 className="filter-section-title">Price Range</h4>
        <div className="price-range">
          <div className="price-inputs">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min={priceRange.min}
              max={filters.priceRange[1]}
              className="price-input"
            />
            <span>to</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min={filters.priceRange[0]}
              max={priceRange.max}
              className="price-input"
            />
          </div>
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="price-slider"
          />
        </div>
      </div>

      {/* Stops */}
      <div className="filter-section">
        <h4 className="filter-section-title">Stops</h4>
        <div className="filter-options">
          {[
            { value: 0, label: "Direct" },
            { value: 1, label: "1 Stop" },
            { value: 2, label: "2+ Stops" },
          ].map((option) => (
            <label key={option.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={() => handleStopsToggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {availableAirlines.length > 0 && (
        <div className="filter-section">
          <h4 className="filter-section-title">Airlines</h4>
          <div className="filter-options">
            {availableAirlines.map((airline) => (
              <label key={airline} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                />
                <span>{airline}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Departure Time */}
      <div className="filter-section">
        <h4 className="filter-section-title">Departure Time</h4>
        <div className="filter-options">
          {[
            { value: "any", label: "Any Time" },
            { value: "morning", label: "Morning (6AM-12PM)" },
            { value: "afternoon", label: "Afternoon (12PM-6PM)" },
            { value: "evening", label: "Evening (6PM-12AM)" },
            { value: "night", label: "Night (12AM-6AM)" },
          ].map((option) => (
            <label key={option.value} className="filter-radio">
              <input
                type="radio"
                name="departureTime"
                value={option.value}
                checked={filters.departureTime === option.value}
                onChange={(e) =>
                  setFilters({ ...filters, departureTime: e.target.value })
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
