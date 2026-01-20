# Flight Search Engine - Backend

RESTful API for flight search functionality using Amadeus API.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and add your Amadeus API credentials:
- Get free test credentials from [Amadeus for Developers](https://developers.amadeus.com/)

### 3. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Search Flights
```
POST /api/flights/search
Content-Type: application/json

{
  "origin": "NYC",
  "destination": "LAX",
  "departureDate": "2026-03-15",
  "returnDate": "2026-03-22",
  "adults": 1,
  "travelClass": "ECONOMY"
}
```

### Get Price History
```
GET /api/flights/price-history?origin=NYC&destination=LAX&departureDate=2026-03-15
```

## 🏗️ Project Structure
```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic & external APIs
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   └── server.js         # Express app setup
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
└── package.json
```

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `AMADEUS_API_KEY` | Amadeus API key | - |
| `AMADEUS_API_SECRET` | Amadeus API secret | - |
| `AMADEUS_API_BASE_URL` | Amadeus API URL | `https://test.api.amadeus.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 📦 Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **dotenv** - Environment variables
- **axios** - HTTP client for Amadeus API
- **nodemon** - Development auto-reload

## 🔐 Amadeus API

This backend uses the [Amadeus Self-Service API](https://developers.amadeus.com/) (Test environment) for:
- Flight Offers Search
- Flight Price Analysis

To get started:
1. Sign up at https://developers.amadeus.com/
2. Create a new app
3. Copy your API Key and API Secret
4. Add them to your `.env` file
