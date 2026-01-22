import axios from 'axios';

class AmadeusService {
  constructor() {
    this.baseURL = process.env.AMADEUS_API_BASE_URL || 'https://test.api.amadeus.com';
    this.apiKey = process.env.AMADEUS_API_KEY;
    this.apiSecret = process.env.AMADEUS_API_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with Amadeus API and get access token
   */
  async authenticate() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret
      });

      const response = await axios.post(
        `${this.baseURL}/v1/security/oauth2/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('❌ Amadeus authentication failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  /**
   * Search for flights
   */
  async searchFlights(params) {
    try {
      const token = await this.authenticate();

      const searchParams = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.adults || 1,
        currencyCode: params.currencyCode || 'USD'
      };

      // Add optional parameters
      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }
      if (params.children > 0) {
        searchParams.children = params.children;
      }
      if (params.infants > 0) {
        searchParams.infants = params.infants;
      }
      if (params.nonStop) {
        searchParams.nonStop = true;
      }
      if (params.travelClass) {
        searchParams.travelClass = params.travelClass;
      }
      if (params.maxResults) {
        searchParams.max = params.maxResults;
      }

      const response = await axios.get(
        `${this.baseURL}/v2/shopping/flight-offers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: searchParams
        }
      );

      return response.data.data || [];
    } catch (error) {
      // Check if it's an authentication error
      if (error.message === 'Failed to authenticate with Amadeus API') {
        console.error('❌ Flight search failed: Authentication error');
        console.error('💡 Tip: Check your AMADEUS_API_KEY and AMADEUS_API_SECRET in .env file');
      } else {
        console.error('❌ Flight search failed:', error.response?.data || error.message);
        if (error.config) {
          console.error('Request URL:', error.config.url);
          console.error('Request params:', error.config.params);
        }
      }

      // Use mock data as fallback for testing
      return this.generateMockFlightData(params);
    }
  }

  /**
   * Generate mock flight data for testing
   */
  generateMockFlightData(params) {
    const flights = [];
    const basePrice = 300;

    for (let i = 0; i < 10; i++) {
      const stops = i < 3 ? 0 : i < 7 ? 1 : 2;
      const price = basePrice + (Math.random() * 400) + (stops * 100);

      const airlines = ['BA', 'EK', 'LH', 'AF', 'KL', 'AA', 'DL', 'UA'];
      const airline = airlines[i % airlines.length];

      const departureDate = new Date(params.departureDate);
      departureDate.setHours(6 + (i * 1.5), Math.floor(Math.random() * 60), 0, 0);

      const duration = 3 + stops * 2 + Math.random() * 3;
      const arrivalDate = new Date(departureDate.getTime() + duration * 60 * 60 * 1000);

      const segments = [];
      for (let s = 0; s <= stops; s++) {
        const segDuration = duration / (stops + 1);
        const segStart = new Date(departureDate.getTime() + s * segDuration * 60 * 60 * 1000);
        const segEnd = new Date(segStart.getTime() + segDuration * 60 * 60 * 1000);

        const layoverAirports = ['AMS', 'CDG', 'FRA', 'MUC', 'IST', 'DXB'];
        const destination = s === stops ? params.destination : layoverAirports[s % layoverAirports.length];

        segments.push({
          departure: {
            iataCode: s === 0 ? params.origin : segments[s - 1].arrival.iataCode,
            at: segStart.toISOString()
          },
          arrival: {
            iataCode: destination,
            at: segEnd.toISOString()
          },
          carrierCode: airline,
          number: (1000 + Math.floor(Math.random() * 8999)).toString(),
          duration: `PT${Math.floor(segDuration)}H${Math.floor((segDuration % 1) * 60)}M`
        });
      }

      flights.push({
        type: 'flight-offer',
        id: (i + 1).toString(),
        source: 'GDS',
        itineraries: [
          {
            duration: `PT${Math.floor(duration)}H${Math.floor((duration % 1) * 60)}M`,
            segments: segments
          }
        ],
        price: {
          currency: params.currencyCode || 'USD',
          total: price.toFixed(2),
          base: (price * 0.85).toFixed(2),
          grandTotal: price.toFixed(2)
        },
        validatingAirlineCodes: [airline]
      });
    }

    return flights;
  }

  /**
   * Get price history for graph visualization
   * Using Flight Price Analysis API
   */
  async getPriceHistory(params) {
    try {
      const token = await this.authenticate();

      const response = await axios.get(
        `${this.baseURL}/v1/analytics/itinerary-price-metrics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            originIataCode: params.origin,
            destinationIataCode: params.destination,
            departureDate: params.departureDate,
            currencyCode: 'USD'
          }
        }
      );

      // Format data for chart
      const metrics = response.data.data[0];
      if (!metrics) {
        // Return mock data if no historical data available
        return this.generateMockPriceHistory(params);
      }

      return {
        prices: metrics.priceMetrics || [],
        quartiles: {
          min: metrics.priceMetrics[0]?.amount,
          max: metrics.priceMetrics[metrics.priceMetrics.length - 1]?.amount,
          median: metrics.priceMetrics[Math.floor(metrics.priceMetrics.length / 2)]?.amount
        }
      };
    } catch (error) {
      // If price analysis is not available in test env, return mock data
      return this.generateMockPriceHistory(params);
    }
  }

  /**
   * Generate mock price history for testing
   */
  generateMockPriceHistory(params) {
    const basePrice = 300;
    const dates = [];
    const departureDate = new Date(params.departureDate);

    // Generate prices for 30 days before departure
    for (let i = 30; i >= 0; i--) {
      const date = new Date(departureDate);
      date.setDate(date.getDate() - i);

      // Add some variation to prices
      const variation = Math.sin(i / 5) * 50 + Math.random() * 30;
      const price = Math.round(basePrice + variation);

      dates.push({
        date: date.toISOString().split('T')[0],
        price: price
      });
    }

    return {
      prices: dates,
      quartiles: {
        min: Math.min(...dates.map(d => d.price)),
        max: Math.max(...dates.map(d => d.price)),
        median: dates[Math.floor(dates.length / 2)].price
      }
    };
  }
}

// Export the class, not an instance
// This ensures environment variables are loaded before instantiation
let instance = null;

export default {
  get instance() {
    if (!instance) {
      instance = new AmadeusService();
    }
    return instance;
  },
  // Also export direct methods for convenience
  searchFlights: (...args) => {
    if (!instance) instance = new AmadeusService();
    return instance.searchFlights(...args);
  },
  getPriceHistory: (...args) => {
    if (!instance) instance = new AmadeusService();
    return instance.getPriceHistory(...args);
  }
};
