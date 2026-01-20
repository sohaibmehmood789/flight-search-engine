import { useState, useRef, useEffect } from "react";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import "./PassengerSelector.css";

const PassengerSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPassengers = value.adults + value.children + value.infants;

  const handleIncrement = (type) => {
    const newValue = { ...value };
    if (type === "adults" && value.adults < 9) {
      newValue.adults += 1;
    } else if (type === "children" && value.children < 8) {
      newValue.children += 1;
    } else if (type === "infants" && value.infants < value.adults) {
      newValue.infants += 1;
    }
    onChange(newValue);
  };

  const handleDecrement = (type) => {
    const newValue = { ...value };
    if (type === "adults" && value.adults > 1) {
      newValue.adults -= 1;
      // Infants can't exceed adults
      if (newValue.infants > newValue.adults) {
        newValue.infants = newValue.adults;
      }
    } else if (type === "children" && value.children > 0) {
      newValue.children -= 1;
    } else if (type === "infants" && value.infants > 0) {
      newValue.infants -= 1;
    }
    onChange(newValue);
  };

  return (
    <div className="passenger-selector" ref={dropdownRef}>
      <button
        type="button"
        className="passenger-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserIcon className="icon" />
        <span>
          {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
        </span>
        <ChevronDownIcon className={`icon chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="passenger-dropdown">
          {/* Adults */}
          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-type">Adults</span>
              <span className="passenger-desc">12+ years</span>
            </div>
            <div className="passenger-counter">
              <button
                type="button"
                onClick={() => handleDecrement("adults")}
                disabled={value.adults <= 1}
                className="counter-button"
              >
                −
              </button>
              <span className="counter-value">{value.adults}</span>
              <button
                type="button"
                onClick={() => handleIncrement("adults")}
                disabled={value.adults >= 9}
                className="counter-button"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-type">Children</span>
              <span className="passenger-desc">2-11 years</span>
            </div>
            <div className="passenger-counter">
              <button
                type="button"
                onClick={() => handleDecrement("children")}
                disabled={value.children <= 0}
                className="counter-button"
              >
                −
              </button>
              <span className="counter-value">{value.children}</span>
              <button
                type="button"
                onClick={() => handleIncrement("children")}
                disabled={value.children >= 8}
                className="counter-button"
              >
                +
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-type">Infants</span>
              <span className="passenger-desc">Under 2 years</span>
            </div>
            <div className="passenger-counter">
              <button
                type="button"
                onClick={() => handleDecrement("infants")}
                disabled={value.infants <= 0}
                className="counter-button"
              >
                −
              </button>
              <span className="counter-value">{value.infants}</span>
              <button
                type="button"
                onClick={() => handleIncrement("infants")}
                disabled={value.infants >= value.adults || value.infants >= 9}
                className="counter-button"
              >
                +
              </button>
            </div>
          </div>

          {value.infants >= value.adults && value.infants > 0 && (
            <p className="passenger-note">
              Each infant must be accompanied by an adult
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;
