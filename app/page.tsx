"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plane, MapPin, Calendar, Users, Search, Star, Shield, Clock, ArrowRight, Sparkles, Mail } from "lucide-react"
import { FirebaseSetupNotification } from "@/components/firebase-setup-notification"
import { useAuth } from "@/components/auth-context"
import { motion } from "framer-motion"
import { AnimatedCard, AnimatedButton, AnimatedText, StaggerContainer, StaggerItem, fadeInUp, hoverLift } from "@/components/animations"

// Indian Cities Data
const INDIAN_CITIES = [
  { code: "DEL", name: "Delhi", fullName: "Delhi (DEL)" },
  { code: "BOM", name: "Mumbai", fullName: "Mumbai (BOM)" },
  { code: "BLR", name: "Bangalore", fullName: "Bangalore (BLR)" },
  { code: "CCU", name: "Kolkata", fullName: "Kolkata (CCU)" },
  { code: "HYD", name: "Hyderabad", fullName: "Hyderabad (HYD)" },
  { code: "AMD", name: "Ahmedabad", fullName: "Ahmedabad (AMD)" },
  { code: "PNQ", name: "Pune", fullName: "Pune (PNQ)" },
  { code: "COK", name: "Kochi", fullName: "Kochi (COK)" },
  { code: "GOI", name: "Goa", fullName: "Goa (GOI)" },
  { code: "TRV", name: "Thiruvananthapuram", fullName: "Thiruvananthapuram (TRV)" },
  { code: "IXC", name: "Chandigarh", fullName: "Chandigarh (IXC)" },
  { code: "LKO", name: "Lucknow", fullName: "Lucknow (LKO)" },
  { code: "JAI", name: "Jaipur", fullName: "Jaipur (JAI)" },
  { code: "IXB", name: "Bagdogra", fullName: "Bagdogra (IXB)" },
  { code: "GAU", name: "Guwahati", fullName: "Guwahati (GAU)" },
  { code: "IDR", name: "Indore", fullName: "Indore (IDR)" },
  { code: "NAG", name: "Nagpur", fullName: "Nagpur (NAG)" },
  { code: "PAT", name: "Patna", fullName: "Patna (PAT)" },
  { code: "RAJ", name: "Rajkot", fullName: "Rajkot (RAJ)" },
  { code: "VNS", name: "Varanasi", fullName: "Varanasi (VNS)" },
  { code: "BHO", name: "Bhopal", fullName: "Bhopal (BHO)" },
  { code: "IXU", name: "Udaipur", fullName: "Udaipur (IXU)" },
  { code: "JDH", name: "Jodhpur", fullName: "Jodhpur (JDH)" },
  { code: "JLR", name: "Jabalpur", fullName: "Jabalpur (JLR)" },
  { code: "Yuva", name: "Surat", fullName: "Surat (Yuva)" },
  { code: "IXE", name: "Mangalore", fullName: "Mangalore (IXE)" },
  { code: "IXM", name: "Madurai", fullName: "Madurai (IXM)" },
  { code: "TIR", name: "Tiruchirapalli", fullName: "Tiruchirapalli (TIR)" },
  { code: "VGA", name: "Vijayawada", fullName: "Vijayawada (VGA)" },
  { code: "VTZ", name: "Visakhapatnam", fullName: "Visakhapatnam (VTZ)" }
]

export default function Home() {
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, router])

  // Handle sign out with proper error handling
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Sign out error:", error)
      router.push("/auth/sign-in")
    }
  }

  const [tripType, setTripType] = useState("roundtrip")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([])
  const [toSuggestions, setToSuggestions] = useState<any[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  // Filter cities based on input
  const filterCities = (input: string) => {
    if (!input) return []
    return INDIAN_CITIES.filter(city => 
      city.name.toLowerCase().includes(input.toLowerCase()) ||
      city.code.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5)
  }

  const handleFromChange = (value: string) => {
    setFrom(value)
    setFromSuggestions(filterCities(value))
    setShowFromSuggestions(true)
  }

  const handleToChange = (value: string) => {
    setTo(value)
    setToSuggestions(filterCities(value))
    setShowToSuggestions(true)
  }

  const selectFromCity = (city: any) => {
    setFrom(city.fullName)
    setFromSuggestions([])
    setShowFromSuggestions(false)
  }

  const selectToCity = (city: any) => {
    setTo(city.fullName)
    setToSuggestions([])
    setShowToSuggestions(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!from || !to || !departDate) {
      alert("Please fill in all required fields")
      return
    }

    if (from === to) {
      alert("Departure and arrival cities cannot be the same")
      return
    }

    console.log("Searching flights...")
    // Store search parameters in localStorage for flights page
    const searchParams = {
      from,
      to,
      departDate,
      returnDate,
      passengers,
      tripType
    }
    localStorage.setItem("searchParams", JSON.stringify(searchParams))
    router.push("/flights")
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Plane className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-bounce" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <p className="text-white/80 text-lg">Loading your journey...</p>
        </div>
      </main>
    )
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Beautiful Flight Wallpaper Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
      }}></div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80"></div>
      
      {/* Firebase Setup Notification */}
      <div className="max-w-7xl mx-auto px-4 pt-4 relative z-10">
        <FirebaseSetupNotification />
      </div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              SkyBook India
            </h1>
          </div>
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => router.push("/bookings")}
              className="text-white/80 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
            >
              My Bookings
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/90 text-sm">Welcome back,</p>
                <p className="text-white font-semibold">{user?.displayName || user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 z-10">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <span className="text-white/90 text-sm font-medium">Your Indian journey starts here</span>
            </motion.div>
            <motion.h2 
              className="text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Explore Incredible
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              > India</motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Discover amazing destinations across India with the best deals on domestic flights. 
              Book with confidence and start your next adventure.
            </motion.p>
          </div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 mb-16 rounded-3xl">
            <form onSubmit={handleSearch}>
              {/* Trip Type Selection */}
              <div className="flex gap-4 mb-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="roundtrip"
                    checked={tripType === "roundtrip"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    Round Trip
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="oneway"
                    checked={tripType === "oneway"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    One Way
                  </span>
                </label>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {/* From */}
                <div className="flex flex-col relative">
                  <label className="text-sm font-semibold text-gray-700 mb-3">From</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Departure city"
                      value={from}
                      onChange={(e) => handleFromChange(e.target.value)}
                      onFocus={() => setShowFromSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                    />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-1">
                        {fromSuggestions.map((city, index) => (
                          <div
                            key={index}
                            onClick={() => selectFromCity(city)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{city.fullName}</div>
                            <div className="text-sm text-gray-600">{city.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* To */}
                <div className="flex flex-col relative">
                  <label className="text-sm font-semibold text-gray-700 mb-3">To</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Arrival city"
                      value={to}
                      onChange={(e) => handleToChange(e.target.value)}
                      onFocus={() => setShowToSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                    />
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-1">
                        {toSuggestions.map((city, index) => (
                          <div
                            key={index}
                            onClick={() => selectToCity(city)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{city.fullName}</div>
                            <div className="text-sm text-gray-600">{city.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Depart Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-3">Depart</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Return Date */}
                {tripType === "roundtrip" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-3">Return</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departDate || new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                  </div>
                )}

                {/* Passengers */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-3">Passengers</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <Search className="w-5 h-5" />
                Search Flights
              </Button>
            </form>
          </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold text-white mb-4">Why Choose SkyBook India?</h3>
            <p className="text-xl text-white/80">Experience the difference with our premium features</p>
          </motion.div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <motion.div
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 group h-full">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Star className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-white mb-4">Best Prices</h4>
                  <p className="text-white/80 leading-relaxed">
                    Compare prices from multiple Indian airlines and find the best deals guaranteed. 
                    We negotiate exclusive rates just for you.
                  </p>
                </Card>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 group h-full">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-white mb-4">Secure Booking</h4>
                  <p className="text-white/80 leading-relaxed">
                    Your bookings are protected with our secure payment system and 
                    comprehensive travel insurance coverage.
                  </p>
                </Card>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 group h-full">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Mail className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-white mb-4">Email Notifications</h4>
                  <p className="text-white/80 leading-relaxed">
                    Get instant email confirmations, flight updates, and important notifications 
                    directly to your inbox.
                  </p>
                </Card>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Popular Indian Destinations */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold text-white mb-4">Popular Indian Destinations</h3>
            <p className="text-xl text-white/80">Discover amazing places across India</p>
          </motion.div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Delhi", image: "🏛️", price: "From ₹3,500" },
              { name: "Mumbai", image: "🏙️", price: "From ₹4,200" },
              { name: "Bangalore", image: "🌆", price: "From ₹3,800" },
              { name: "Goa", image: "🏖️", price: "From ₹2,900" },
              { name: "Kolkata", image: "🌉", price: "From ₹4,500" },
              { name: "Hyderabad", image: "🏰", price: "From ₹3,200" },
              { name: "Pune", image: "🏔️", price: "From ₹2,800" },
              { name: "Kochi", image: "🌴", price: "From ₹3,600" }
            ].map((destination, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ 
                    y: -8,
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group h-full">
                    <motion.div 
                      className="text-4xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {destination.image}
                    </motion.div>
                    <h4 className="text-xl font-bold text-white mb-2">{destination.name}</h4>
                    <p className="text-white/80">{destination.price}</p>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  )
}