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

      const response = await axios.post(
        `${this.baseURL}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      console.log('✅ Amadeus API authenticated successfully');
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
        adults: params.adults,
        max: params.maxResults,
        currencyCode: params.currencyCode,
        travelClass: params.travelClass
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
        searchParams.nonStop = 'true';
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

      console.log(`✅ Found ${response.data.data?.length || 0} flight offers`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Flight search failed:', error.response?.data || error.message);
      throw error;
    }
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
      console.log('⚠️ Price history not available, generating mock data');
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

export default new AmadeusService();
