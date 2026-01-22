# Flight Search Engine ✈️

A full-stack flight search application that allows users to search for flights, compare prices, and visualize price trends using the Amadeus API.

## 🌟 Features

- **Real-time Flight Search**: Search flights using Amadeus API
- **Advanced Filters**: Filter by price, stops, airlines, departure times
- **Price Visualization**: Interactive price trend graphs
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Multi-passenger Support**: Book for adults, children, and infants
- **Travel Class Selection**: Economy, Premium Economy, Business, First Class

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **React DatePicker** - Date selection
- **Axios** - HTTP client
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Amadeus API** - Flight data provider
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Amadeus API credentials ([Get them here](https://developers.amadeus.com))
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sohaibmehmood789/flight-search-engine.git
cd flight-search-engine
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Amadeus API credentials
nano .env  # or use your preferred editor
```

**Backend `.env` configuration:**
```env
PORT=5000
NODE_ENV=development
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
AMADEUS_API_BASE_URL=https://test.api.amadeus.com
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Frontend `.env` configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
App will run on `http://localhost:5173`

### 5. Open in Browser

Visit `http://localhost:5173` and start searching for flights!

## 📁 Project Structure

```
flight-search-engine/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── flightController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   └── flightRoutes.js
│   │   ├── services/
│   │   │   └── amadeusService.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── server.js
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Filters/
│   │   │   ├── FlightList/
│   │   │   ├── PriceGraph/
│   │   │   └── SearchForm/
│   │   ├── context/
│   │   │   └── FlightContext.jsx
│   │   ├── hooks/
│   │   │   └── useFlightSearch.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .gitignore
├── railway.toml
├── vercel.json
├── DEPLOYMENT.md
├── PROJECT_BREAKDOWN.md
├── PROJECT_STRUCTURE.md
└── README.md
```

## 🔌 API Endpoints

### Backend API

**Base URL:** `http://localhost:5000/api`

#### Health Check
```
GET /api/health
```
Returns server status

#### Search Flights
```
POST /api/flights/search

Body:
{
  "origin": "JFK",
  "destination": "LAX",
  "departureDate": "2026-02-15",
  "returnDate": "2026-02-22",  // Optional
  "adults": 1,
  "children": 0,
  "infants": 0,
  "travelClass": "ECONOMY",
  "nonStop": false,
  "currencyCode": "USD"
}
```

#### Get Price History
```
GET /api/flights/price-history

Query Parameters:
- origin: string (IATA code)
- destination: string (IATA code)
- departureDate: string (YYYY-MM-DD)
```

## 🌐 Deployment

### Production Deployment

This application is deployed on:
- **Frontend**: Vercel
- **Backend**: Railway

**Live URLs:**
- Frontend: `https://flight-search-engine-uiw5.vercel.app`
- Backend: `https://flight-search-engine-production.up.railway.app`

## 📝 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔑 Getting Amadeus API Credentials

1. Visit [Amadeus for Developers](https://developers.amadeus.com)
2. Create a free account
3. Create a new app
4. Copy your API Key and API Secret
5. Use test environment for development

**API Limits (Test):**
- 10 API calls per second
- 10,000 API calls per month

## 👨‍💻 Author

**Sohaib Mehmood**
- GitHub: [@sohaibmehmood789](https://github.com/sohaibmehmood789)

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com) - Flight data API
- [Railway](https://railway.app) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool


## 🗺️ Further Possible Improvements

- [ ] User authentication
- [ ] Booking functionality
- [ ] Flight price alerts
- [ ] Multi-city search
- [ ] Seat selection
- [ ] Payment integration
- [ ] Email notifications
- [ ] Trip management dashboard
