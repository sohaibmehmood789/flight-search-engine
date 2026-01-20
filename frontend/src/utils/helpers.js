import { format } from "date-fns";

/**
 * Format date to YYYY-MM-DD for API
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    console.error("Date formatting error");
    return null;
  }
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (date, formatStr = "MMM dd, yyyy") => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return date;
  }
};

/**
 * Format time from ISO string
 */
export const formatTime = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return format(date, "HH:mm");
  } catch {
    return isoString;
  }
};

/**
 * Calculate duration in hours and minutes
 */
export const formatDuration = (isoDuration) => {
  if (!isoDuration) return "";

  // Parse ISO 8601 duration (e.g., PT5H30M)
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return isoDuration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}m`;
  return "";
};

/**
 * Format price with currency
 */
export const formatPrice = (price, currency = "USD") => {
  if (!price) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  } catch {
    return `${currency} ${price}`;
  }
};

/**
 * Get airline name from code
 */
export const getAirlineName = (code) => {
  const airlines = {
    AA: "American Airlines",
    DL: "Delta Air Lines",
    UA: "United Airlines",
    BA: "British Airways",
    LH: "Lufthansa",
    AF: "Air France",
    KL: "KLM",
    EK: "Emirates",
    QR: "Qatar Airways",
    SQ: "Singapore Airlines",
  };
  return airlines[code] || code;
};

/**
 * Get number of stops text
 */
export const getStopsText = (stops) => {
  if (stops === 0) return "Nonstop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
};

/**
 * Validate IATA code
 */
export const isValidIATA = (code) => {
  return /^[A-Z]{3}$/.test(code);
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};
