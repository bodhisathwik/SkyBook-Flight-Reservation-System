# SkyBook Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git (for version control)
- A code editor (VS Code recommended)

### 2. Installation Steps

#### Clone the Repository
\`\`\`bash
git clone <repository-url>
cd skybook
\`\`\`

#### Install Dependencies
\`\`\`bash
npm install
\`\`\`

#### Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

### 3. First Time Setup

1. **Create an Account**
   - Click "Sign Up" on the homepage
   - Enter your name, email, and password
   - You'll be logged in automatically

2. **Search for Flights**
   - Enter departure and arrival cities
   - Select dates and number of passengers
   - Click "Search Flights"

3. **Book a Flight**
   - Select a flight from the results
   - Click "Select Seats"
   - Choose your preferred seats
   - Proceed to checkout
   - Enter payment details (test card: 4242 4242 4242 4242)
   - Complete the booking

4. **Manage Bookings**
   - Click "My Bookings" in the header
   - View your booking details
   - Download tickets or cancel bookings

## Development Setup

### Project Structure
\`\`\`
skybook/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── flights/           # Flights page
│   ├── bookings/          # Bookings page
│   ├── checkout/          # Checkout page
│   ├── booking-confirmation/ # Confirmation page
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── auth-context.tsx   # Auth provider
│   ├── seat-selection-modal.tsx # Seat modal
│   └── ui/                # shadcn/ui components
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Documentation
\`\`\`

### Available Scripts

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
\`\`\`

### Environment Variables

Currently, the application doesn't require environment variables. In the future, add a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
\`\`\`

## Configuration

### Tailwind CSS
Configuration is in `app/globals.css` using Tailwind v4 inline theme.

### TypeScript
Configuration is in `tsconfig.json` with strict mode enabled.

### Next.js
Configuration is in `next.config.mjs` with default settings.

## Common Tasks

### Adding a New Page

1. Create a new directory in `/app`
2. Create a `page.tsx` file
3. Export a default React component

Example:
\`\`\`tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <main>New Page</main>
}
\`\`\`

### Adding a New Component

1. Create a new file in `/components`
2. Export a React component

Example:
\`\`\`tsx
// components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>
}
\`\`\`

### Using Authentication

\`\`\`tsx
import { useAuth } from "@/components/auth-context"

export function MyComponent() {
  const { user, signOut } = useAuth()
  
  if (!user) return <div>Not logged in</div>
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
\`\`\`

### Styling Components

Use Tailwind CSS classes:

\`\`\`tsx
export function MyComponent() {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
      <h2 className="text-lg font-bold text-gray-900">Title</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Action
      </button>
    </div>
  )
}
\`\`\`

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Dependencies Not Installing
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### TypeScript Errors
\`\`\`bash
npm run build
\`\`\`

### Clearing Cache
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## Backend Integration

### Setting Up API Routes

Create API routes in `/app/api`:

\`\`\`tsx
// app/api/flights/route.ts
export async function GET(request: Request) {
  // Handle GET request
  return Response.json({ flights: [] })
}
\`\`\`

### Connecting to Database

1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Install database client (Prisma, Drizzle, etc.)
3. Create database models
4. Update API routes to query database

### Integrating Payment Gateway

1. Sign up for Stripe or PayPal
2. Add API keys to environment variables
3. Install payment SDK
4. Update checkout page to use real payment processing

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push
4. Set environment variables in Vercel dashboard

### Deploy to Other Platforms

**Netlify:**
\`\`\`bash
npm run build
# Deploy the .next folder
\`\`\`

**Docker:**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Performance Tips

1. **Use React DevTools** to identify unnecessary re-renders
2. **Lazy load components** with `React.lazy()`
3. **Optimize images** with Next.js Image component
4. **Monitor bundle size** with `npm run build`
5. **Use production builds** for testing performance

## Security Best Practices

1. Never commit `.env.local` to version control
2. Validate all user inputs on the server
3. Use HTTPS in production
4. Implement rate limiting
5. Sanitize user-generated content
6. Keep dependencies updated

## Getting Help

- Check the README.md for feature documentation
- Review ARCHITECTURE.md for system design
- Check component comments for usage examples
- Open an issue on GitHub for bugs
- Contact support@skybook.com for help

---

**Last Updated:** October 17, 2024
