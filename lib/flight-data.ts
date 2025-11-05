// India cities and airports data
export interface City {
  code: string
  name: string
  state: string
  airport: string
}

export const INDIAN_CITIES: City[] = [
  { code: "DEL", name: "New Delhi", state: "Delhi", airport: "Indira Gandhi International Airport" },
  { code: "BOM", name: "Mumbai", state: "Maharashtra", airport: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "BLR", name: "Bangalore", state: "Karnataka", airport: "Kempegowda International Airport" },
  { code: "CCU", name: "Kolkata", state: "West Bengal", airport: "Netaji Subhash Chandra Bose International Airport" },
  { code: "MAA", name: "Chennai", state: "Tamil Nadu", airport: "Chennai International Airport" },
  { code: "HYD", name: "Hyderabad", state: "Telangana", airport: "Rajiv Gandhi International Airport" },
  { code: "AMD", name: "Ahmedabad", state: "Gujarat", airport: "Sardar Vallabhbhai Patel International Airport" },
  { code: "PNQ", name: "Pune", state: "Maharashtra", airport: "Pune Airport" },
  { code: "COK", name: "Kochi", state: "Kerala", airport: "Cochin International Airport" },
  { code: "TRV", name: "Thiruvananthapuram", state: "Kerala", airport: "Trivandrum International Airport" },
  { code: "GOI", name: "Goa", state: "Goa", airport: "Goa International Airport" },
  { code: "JAI", name: "Jaipur", state: "Rajasthan", airport: "Jaipur International Airport" },
  { code: "LKO", name: "Lucknow", state: "Uttar Pradesh", airport: "Chaudhary Charan Singh International Airport" },
  { code: "IXB", name: "Bagdogra", state: "West Bengal", airport: "Bagdogra Airport" },
  { code: "GAU", name: "Guwahati", state: "Assam", airport: "Lokpriya Gopinath Bordoloi International Airport" },
  { code: "PAT", name: "Patna", state: "Bihar", airport: "Jay Prakash Narayan Airport" },
  { code: "BHO", name: "Bhopal", state: "Madhya Pradesh", airport: "Raja Bhoj Airport" },
  { code: "IDR", name: "Indore", state: "Madhya Pradesh", airport: "Devi Ahilya Bai Holkar Airport" },
  { code: "NAG", name: "Nagpur", state: "Maharashtra", airport: "Dr. Babasaheb Ambedkar International Airport" },
  { code: "VGA", name: "Vijayawada", state: "Andhra Pradesh", airport: "Vijayawada Airport" },
  { code: "IXC", name: "Chandigarh", state: "Punjab", airport: "Chandigarh Airport" },
  { code: "UDR", name: "Udaipur", state: "Rajasthan", airport: "Maharana Pratap Airport" },
  { code: "JDH", name: "Jodhpur", state: "Rajasthan", airport: "Jodhpur Airport" },
  { code: "IXU", name: "Udaipur", state: "Rajasthan", airport: "Maharana Pratap Airport" },
  { code: "RPR", name: "Raipur", state: "Chhattisgarh", airport: "Swami Vivekananda Airport" },
  { code: "IXA", name: "Agartala", state: "Tripura", airport: "Agartala Airport" },
  { code: "IXJ", name: "Jammu", state: "Jammu and Kashmir", airport: "Jammu Airport" },
  { code: "SXR", name: "Srinagar", state: "Jammu and Kashmir", airport: "Srinagar Airport" },
  { code: "IXL", name: "Leh", state: "Ladakh", airport: "Kushok Bakula Rimpochee Airport" }
]

// Real-time flight data (simulated)
export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  amenities: string[]
  rating: number
  availableSeats: number
  aircraft: string
  gate?: string
  terminal?: string
}

// Indian airlines
export const INDIAN_AIRLINES = [
  "Air India",
  "IndiGo",
  "SpiceJet",
  "Vistara",
  "AirAsia India",
  "GoAir",
  "Alliance Air",
  "TruJet"
]

// Generate real-time flights between Indian cities
export function generateRealTimeFlights(from: string, to: string): Flight[] {
  if (!from || !to || from === to) return []

  const fromCity = INDIAN_CITIES.find(city => city.code === from)
  const toCity = INDIAN_CITIES.find(city => city.code === to)
  
  if (!fromCity || !toCity) return []

  const flights: Flight[] = []
  const numFlights = Math.floor(Math.random() * 8) + 3 // 3-10 flights

  for (let i = 0; i < numFlights; i++) {
    const airline = INDIAN_AIRLINES[Math.floor(Math.random() * INDIAN_AIRLINES.length)]
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`
    
    // Generate realistic departure times (6 AM to 10 PM)
    const hour = Math.floor(Math.random() * 17) + 6
    const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
    const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    
    // Calculate arrival time (add flight duration)
    const flightDuration = Math.floor(Math.random() * 3) + 1 // 1-4 hours
    const arrivalHour = (hour + flightDuration) % 24
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    
    const duration = `${flightDuration}h ${Math.floor(Math.random() * 60)}m`
    const basePrice = Math.floor(Math.random() * 15000) + 3000 // ₹3000-₹18000
    const availableSeats = Math.floor(Math.random() * 50) + 10 // 10-60 seats
    
    const amenities = []
    if (Math.random() > 0.3) amenities.push("WiFi")
    if (Math.random() > 0.4) amenities.push("Meals")
    if (Math.random() > 0.2) amenities.push("Entertainment")
    if (Math.random() > 0.7) amenities.push("Priority")

    flights.push({
      id: `flight-${i + 1}`,
      airline,
      flightNumber,
      departure: `${fromCity.name} (${from})`,
      arrival: `${toCity.name} (${to})`,
      departureTime,
      arrivalTime,
      duration,
      price: basePrice,
      stops: Math.random() > 0.8 ? 1 : 0, // 20% chance of stop
      amenities,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0 rating
      availableSeats,
      aircraft: ["Boeing 737", "Airbus A320", "Boeing 777", "Airbus A321"][Math.floor(Math.random() * 4)],
      gate: `G${Math.floor(Math.random() * 20) + 1}`,
      terminal: ["T1", "T2", "T3"][Math.floor(Math.random() * 3)]
    })
  }

  return flights.sort((a, b) => a.price - b.price)
}

// Search cities by name or code
export function searchCities(query: string): City[] {
  if (!query) return []
  
  const lowercaseQuery = query.toLowerCase()
  return INDIAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.code.toLowerCase().includes(lowercaseQuery) ||
    city.state.toLowerCase().includes(lowercaseQuery) ||
    city.airport.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10) // Limit to 10 results
}
