import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import AirportInput from "./AirportInput";
import PassengerSelector from "./PassengerSelector";
import { formatDateForAPI } from "../../utils/helpers";
import { TRAVEL_CLASSES } from "../../utils/constants";
import "./SearchForm.css";

const SearchForm = ({ onSearch, loading }) => {
  const [tripType, setTripType] = useState("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [errors, setErrors] = useState({});

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!origin) newErrors.origin = "Origin is required";
    if (!destination) newErrors.destination = "Destination is required";
    if (!departureDate) newErrors.departureDate = "Departure date is required";
    if (tripType === "round-trip" && !returnDate) {
      newErrors.returnDate = "Return date is required";
    }
    if (
      tripType === "round-trip" &&
      returnDate &&
      departureDate &&
      returnDate < departureDate
    ) {
      newErrors.returnDate = "Return date must be after departure date";
    }
    if (origin === destination) {
      newErrors.destination = "Destination must be different from origin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const searchParams = {
      origin,
      destination,
      departureDate: formatDateForAPI(departureDate),
      returnDate:
        tripType === "round-trip" ? formatDateForAPI(returnDate) : null,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      travelClass,
    };

    onSearch(searchParams);
  };

  const today = new Date();

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      {/* Trip Type Toggle */}
      <div className="trip-type-toggle">
        <button
          type="button"
          className={tripType === "round-trip" ? "active" : ""}
          onClick={() => setTripType("round-trip")}
        >
          Round Trip
        </button>
        <button
          type="button"
          className={tripType === "one-way" ? "active" : ""}
          onClick={() => setTripType("one-way")}
        >
          One Way
        </button>
      </div>

      {/* Main Search Fields */}
      <div className="search-grid">
        {/* Origin */}
        <div className="form-group">
          <label htmlFor="origin">From</label>
          <AirportInput
            id="origin"
            value={origin}
            onChange={setOrigin}
            placeholder="Origin city or airport"
            error={errors.origin}
          />
          {errors.origin && (
            <span className="error-message">{errors.origin}</span>
          )}
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className="swap-button"
          onClick={handleSwapAirports}
          aria-label="Swap airports"
        >
          <ArrowsRightLeftIcon className="icon" />
        </button>

        {/* Destination */}
        <div className="form-group">
          <label htmlFor="destination">To</label>
          <AirportInput
            id="destination"
            value={destination}
            onChange={setDestination}
            placeholder="Destination city or airport"
            error={errors.destination}
          />
          {errors.destination && (
            <span className="error-message">{errors.destination}</span>
          )}
        </div>

        {/* Departure Date */}
        <div className="form-group">
          <label htmlFor="departure">Departure</label>
          <DatePicker
            id="departure"
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            minDate={today}
            dateFormat="MMM dd, yyyy"
            placeholderText="Select date"
            className={`date-input ${errors.departureDate ? "error" : ""}`}
          />
          {errors.departureDate && (
            <span className="error-message">{errors.departureDate}</span>
          )}
        </div>

        {/* Return Date */}
        {tripType === "round-trip" && (
          <div className="form-group">
            <label htmlFor="return">Return</label>
            <DatePicker
              id="return"
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              minDate={departureDate || today}
              dateFormat="MMM dd, yyyy"
              placeholderText="Select date"
              className={`date-input ${errors.returnDate ? "error" : ""}`}
            />
            {errors.returnDate && (
              <span className="error-message">{errors.returnDate}</span>
            )}
          </div>
        )}

        {/* Passengers */}
        <div className="form-group">
          <label>Passengers</label>
          <PassengerSelector value={passengers} onChange={setPassengers} />
        </div>

        {/* Travel Class */}
        <div className="form-group">
          <label htmlFor="class">Class</label>
          <select
            id="class"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="class-select"
          >
            {TRAVEL_CLASSES.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button type="submit" className="search-button" disabled={loading}>
        <MagnifyingGlassIcon className="icon" />
        {loading ? "Searching..." : "Search Flights"}
      </button>
    </form>
  );
};

export default SearchForm;
