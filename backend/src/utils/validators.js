/**
 * Validate IATA airport code (3 letters)
 */
export const isValidIataCode = (code) => {
  return /^[A-Z]{3}$/.test(code);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate that date is in the future
 */
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validate passenger count
 */
export const isValidPassengerCount = (count) => {
  return Number.isInteger(count) && count > 0 && count <= 9;
};

/**
 * Validate travel class
 */
export const isValidTravelClass = (travelClass) => {
  const validClasses = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];
  return validClasses.includes(travelClass);
};
