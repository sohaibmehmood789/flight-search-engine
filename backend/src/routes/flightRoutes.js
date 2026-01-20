import express from 'express';
import { searchFlights, getPriceHistory } from '../controllers/flightController.js';

const router = express.Router();

// POST /api/flights/search - Search for flights
router.post('/search', searchFlights);

// GET /api/flights/price-history - Get price history for graph
router.get('/price-history', getPriceHistory);

export default router;
