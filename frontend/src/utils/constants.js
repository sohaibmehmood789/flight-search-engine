export const AIRPORT_CODES = [
  {
    code: "JFK",
    city: "New York",
    name: "John F. Kennedy International",
    country: "USA",
  },
  {
    code: "LAX",
    city: "Los Angeles",
    name: "Los Angeles International",
    country: "USA",
  },
  {
    code: "ORD",
    city: "Chicago",
    name: "O'Hare International",
    country: "USA",
  },
  { code: "MIA", city: "Miami", name: "Miami International", country: "USA" },
  {
    code: "SFO",
    city: "San Francisco",
    name: "San Francisco International",
    country: "USA",
  },
  { code: "LHR", city: "London", name: "Heathrow", country: "UK" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  {
    code: "FRA",
    city: "Frankfurt",
    name: "Frankfurt Airport",
    country: "Germany",
  },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
  {
    code: "MAD",
    city: "Madrid",
    name: "Adolfo Suárez Madrid-Barajas",
    country: "Spain",
  },
  {
    code: "FCO",
    city: "Rome",
    name: "Leonardo da Vinci-Fiumicino",
    country: "Italy",
  },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  {
    code: "HKG",
    city: "Hong Kong",
    name: "Hong Kong International",
    country: "Hong Kong",
  },
  {
    code: "SYD",
    city: "Sydney",
    name: "Kingsford Smith",
    country: "Australia",
  },
  {
    code: "YYZ",
    city: "Toronto",
    name: "Pearson International",
    country: "Canada",
  },
  {
    code: "MEX",
    city: "Mexico City",
    name: "Mexico City International",
    country: "Mexico",
  },
  {
    code: "GRU",
    city: "São Paulo",
    name: "Guarulhos International",
    country: "Brazil",
  },
  {
    code: "BOM",
    city: "Mumbai",
    name: "Chhatrapati Shivaji Maharaj",
    country: "India",
  },
];

export const TRAVEL_CLASSES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
];

export const PASSENGER_LIMITS = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  infants: { min: 0, max: 9 },
};

export const FILTER_DEFAULTS = {
  priceRange: [0, 5000],
  stops: [],
  airlines: [],
  departureTime: "any",
  maxDuration: 24,
};
