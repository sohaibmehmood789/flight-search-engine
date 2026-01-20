import { useState, useRef, useEffect } from "react";
import { AIRPORT_CODES } from "../../utils/constants";
import "./AirportInput.css";

const AirportInput = ({ id, value, onChange, placeholder, error }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Initialize input with value
    if (value) {
      const airport = AIRPORT_CODES.find((a) => a.code === value);
      if (airport) {
        queueMicrotask(() => {
          setInputValue(`${airport.city} (${airport.code})`);
        });
      }
    }
  }, [value]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.length >= 2) {
      const filtered = AIRPORT_CODES.filter(
        (airport) =>
          airport.city.toLowerCase().includes(input.toLowerCase()) ||
          airport.code.toLowerCase().includes(input.toLowerCase()) ||
          airport.name.toLowerCase().includes(input.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (airport) => {
    setInputValue(`${airport.city} (${airport.code})`);
    onChange(airport.code);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="airport-input-wrapper">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() =>
          inputValue.length >= 2 &&
          setSuggestions.length > 0 &&
          setShowSuggestions(true)
        }
        placeholder={placeholder}
        className={`airport-input ${error ? "error" : ""}`}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((airport, index) => (
            <li
              key={airport.code}
              className={`suggestion-item ${index === selectedIndex ? "selected" : ""}`}
              onClick={() => handleSuggestionClick(airport)}
            >
              <div className="airport-info">
                <span className="airport-code">{airport.code}</span>
                <span className="airport-city">{airport.city}</span>
              </div>
              <div className="airport-name">{airport.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportInput;
