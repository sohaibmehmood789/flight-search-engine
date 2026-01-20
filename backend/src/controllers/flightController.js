import { asyncHandler } from '../middleware/errorHandler.js';
import amadeusService from '../services/amadeusService.js';

/**
 * @route   POST /api/flights/search
 * @desc    Search for flights based on criteria
 * @access  Public
 */
export const searchFlights = asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    travelClass = 'ECONOMY',
    nonStop = false,
    currencyCode = 'USD',
    maxResults = 50
  } = req.body;

  // Validation
  if (!origin || !destination || !departureDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: origin, destination, and departureDate are required'
    });
  }

  // Call Amadeus service
  const flights = await amadeusService.searchFlights({
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    nonStop,
    currencyCode,
    maxResults
  });

  res.json({
    success: true,
    data: flights,
    count: flights.length
  });
});

/**
 * @route   GET /api/flights/price-history
 * @desc    Get price history for graph visualization
 * @access  Public
 */
export const getPriceHistory = asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departureDate
  } = req.query;

  // Validation
  if (!origin || !destination || !departureDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required query parameters: origin, destination, and departureDate'
    });
  }

  // Call Amadeus service
  const priceHistory = await amadeusService.getPriceHistory({
    origin,
    destination,
    departureDate
  });

  res.json({
    success: true,
    data: priceHistory
  });
});
