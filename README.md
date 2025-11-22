# SkyBook - Flight Reservation System

A modern, full-stack flight reservation system built with Next.js, React, and TypeScript. This application allows users to search for flights, select seats, manage bookings, and complete payments.

live: https://sky-book-flight-reservation-system-npcskc4vo.vercel.app

## Features

### Core Features
- **Flight Search**: Search for flights by departure/arrival cities, dates, and number of passengers
- **Seat Selection**: Interactive seat map with real-time availability and seat type differentiation
- **Booking Management**: View, manage, and cancel existing bookings
- **User Authentication**: Sign up and sign in with email/password
- **Payment Processing**: Secure checkout with credit card and PayPal options
- **Booking Confirmation**: Instant confirmation with booking reference and ticket download

### Technical Features
- Responsive design that works on desktop, tablet, and mobile
- Real-time form validation
- Error handling and user feedback
- Secure payment form with input formatting
- Persistent user sessions with localStorage
- Modern UI with Tailwind CSS and shadcn/ui components

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Homepage with flight search
│   ├── layout.tsx               # Root layout with auth provider
│   ├── flights/
│   │   └── page.tsx             # Flight listing and seat selection
│   ├── bookings/
│   │   └── page.tsx             # Booking management dashboard
│   ├── checkout/
│   │   └── page.tsx             # Payment checkout page
│   ├── booking-confirmation/
│   │   └── page.tsx             # Booking confirmation page
│   ├── auth/
│   │   ├── sign-up/
│   │   │   └── page.tsx         # Sign up page
│   │   └── sign-in/
│   │       └── page.tsx         # Sign in page
│   └── globals.css              # Global styles and theme
├── components/
│   ├── auth-context.tsx         # Authentication context provider
│   ├── seat-selection-modal.tsx # Seat selection modal component
│   └── ui/                      # shadcn/ui components
└── README.md                    # This file
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd skybook
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Searching for Flights
1. Navigate to the homepage
2. Select trip type (round trip or one way)
3. Enter departure and arrival cities
4. Select departure date (and return date for round trips)
5. Choose number of passengers
6. Click "Search Flights"

### Booking a Flight
1. From the flights list, click "Select Seats" on your preferred flight
2. Choose your seats from the interactive seat map
3. Confirm your seat selection
4. Proceed to checkout
5. Enter payment information
6. Complete the booking

### Managing Bookings
1. Sign in to your account
2. Navigate to "My Bookings"
3. View booking details by clicking on any booking
4. Download tickets or cancel bookings as needed

### Authentication
- **Sign Up**: Create a new account with email and password
- **Sign In**: Log in with your credentials
- **Sign Out**: Available from the user menu (to be implemented)

## Component Documentation

### AuthContext
Manages user authentication state across the application.

**Usage:**
\`\`\`tsx
import { useAuth } from "@/components/auth-context"

function MyComponent() {
  const { user, signIn, signOut } = useAuth()
  // Use auth functions
}
\`\`\`

### SeatSelectionModal
Interactive modal for selecting flight seats.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `onConfirm: (selectedSeats: string[]) => void` - Callback with selected seats
- `flightNumber: string` - Flight number to display
- `passengers: number` - Number of seats to select

**Usage:**
\`\`\`tsx
<SeatSelectionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleSeatsConfirmed}
  flightNumber="SA101"
  passengers={1}
/>
\`\`\`

## API Integration (Future)

The application is currently using mock data. To integrate with a real backend:

### Flight Search API
\`\`\`
GET /api/flights?from=JFK&to=LAX&date=2024-12-15&passengers=1
\`\`\`

### Booking API
\`\`\`
POST /api/bookings
{
  "flightId": "1",
  "seats": ["12A"],
  "passengers": ["John Doe"],
  "totalPrice": 344
}
\`\`\`

### Payment API
\`\`\`
POST /api/payments
{
  "bookingId": "SB123456",
  "amount": 344,
  "paymentMethod": "card",
  "cardDetails": {...}
}
\`\`\`

## Authentication Flow

The application uses a context-based authentication system:

1. User signs up/in with email and password
2. User data is stored in localStorage (mock implementation)
3. AuthProvider wraps the entire app
4. Components access auth state via `useAuth()` hook
5. Protected routes check for user authentication

**Note:** In production, replace localStorage with secure backend authentication (JWT, sessions, etc.)

## Styling

The application uses:
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** for pre-built components
- **Custom design tokens** in `globals.css` for consistent theming
- **Responsive design** with mobile-first approach

### Color Scheme
- Primary: Blue (#2563eb)
- Secondary: Gray (various shades)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Error: Red (#dc2626)

## Performance Optimizations

- Client-side rendering for interactive components
- Lazy loading of modals and dialogs
- Optimized re-renders with React hooks
- Efficient state management with Context API
- CSS-in-JS with Tailwind for minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Real backend API integration
- [ ] Database integration (Supabase, PostgreSQL)
- [ ] Real payment processing (Stripe, PayPal)
- [ ] Email notifications
- [ ] Flight filters and sorting
- [ ] Baggage management
- [ ] Travel insurance options
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Admin dashboard
- [ ] Analytics and reporting

## Troubleshooting

### Bookings not persisting
Currently, bookings are stored in component state. To persist bookings, integrate with a backend database.

### Payment not processing
The checkout page is a UI mockup. Integrate with Stripe or PayPal API for real payments.

### Authentication issues
User data is stored in localStorage. Clear browser storage if experiencing login issues.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@skybook.com or open an issue on GitHub.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push
4. Set environment variables in Vercel dashboard

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Heroku
- Self-hosted servers

## Changelog

### Version 1.0.0 (Initial Release)
- Flight search functionality
- Seat selection system
- Booking management
- User authentication
- Payment checkout flow
- Booking confirmation

---

**Last Updated:** October 17, 2024
