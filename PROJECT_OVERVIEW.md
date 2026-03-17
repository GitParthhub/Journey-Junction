# Journey Junction - Project Overview

## Introduction

Journey Junction is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that enables users to plan, manage, and share their travel experiences. The application provides a comprehensive platform for trip planning with user authentication, trip management, and administrative controls.

## Architecture Overview

### Three-Tier Architecture

**1. Frontend Layer (React)**
- Single Page Application (SPA) built with React 19
- Component-based architecture for modularity and reusability
- React Router DOM for seamless client-side navigation
- Context API for global state management (authentication state, user data)
- Axios for asynchronous HTTP communication with the backend
- CSS3 with custom design system featuring a cohesive color palette

**2. Backend Layer (Node.js + Express)**
- RESTful API server handling all business logic
- Express.js middleware for request processing, authentication, and error handling
- Modular structure with separate controllers for different features (auth, trips, admin)
- JWT-based stateless authentication for secure user sessions
- Role-based access control (RBAC) distinguishing between regular users and administrators

**3. Database Layer (MongoDB)**
- NoSQL document database storing user profiles and trip information
- Mongoose ODM (Object Document Mapper) for schema validation and data modeling
- Two primary collections: Users and Trips with defined relationships

## Technology Stack Details

### Backend Technologies

**Node.js & Express.js**
- Node.js provides a JavaScript runtime for server-side development
- Express.js simplifies HTTP request handling, routing, and middleware management
- Enables rapid API development with minimal boilerplate code

**MongoDB & Mongoose**
- MongoDB stores data in flexible JSON-like documents
- Mongoose provides schema validation, type casting, and query building
- Supports scalability and horizontal data distribution

**Authentication & Security**
- JWT (JSON Web Tokens) enables stateless authentication without server-side sessions
- bcryptjs hashes passwords using salt rounds, preventing plaintext storage
- Middleware validates tokens on protected routes before processing requests
- CORS (Cross-Origin Resource Sharing) allows secure frontend-backend communication

### Frontend Technologies

**React 19**
- Component-based UI development with reusable, maintainable code
- Virtual DOM for efficient rendering and performance optimization
- Hooks for state management and side effects

**React Router DOM**
- Client-side routing without full page reloads
- Dynamic route parameters for trip details and user-specific pages
- Protected routes preventing unauthorized access to admin and user pages

**State Management**
- Context API provides centralized authentication state
- Reduces prop drilling and simplifies data flow
- Stores user information, authentication tokens, and role information

**HTTP Communication**
- Axios handles all API requests with interceptors for token attachment
- Automatic error handling and response transformation
- Request/response interceptors for consistent API communication patterns

**Styling**
- CSS3 with custom CSS variables for consistent theming
- Responsive design using Flexbox and CSS Grid
- Gradient backgrounds, shadows, and animations for modern UI
- Mobile-first approach ensuring accessibility across devices

## Core Features & Implementation

### User Features

**Authentication System**
- Registration: Users create accounts with name, email, and password
- Login: JWT tokens issued upon successful authentication
- Protected Routes: PrivateRoute component restricts access to authenticated users
- Profile Management: Users can view their profile information

**Trip Management**
- Create Trips: Users plan trips with destination, dates, budget, and activities
- View Trips: Dashboard displays all user-created trips
- Edit Trips: Modify trip details after creation
- Delete Trips: Remove trips from the system
- Trip Status: Track trips as planned, ongoing, or completed

**Featured Trips**
- Browse community trips marked as featured by administrators
- Discover popular destinations and travel ideas
- View detailed trip information without editing capabilities

### Admin Features

**Administrative Dashboard**
- Statistics: View total users, trips, and system metrics
- Trip Management: Access all trips in the system
- User Management: View all registered users
- Feature Control: Mark trips as featured for community visibility
- User Deletion: Remove users from the system if needed

## Data Models

### User Model
```
{
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: String (enum: 'user' or 'admin'),
  createdAt: Date
}
```

### Trip Model
```
{
  title: String,
  destination: String,
  description: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  image: String (URL),
  isFeatured: Boolean,
  userId: ObjectId (reference to User),
  activities: [String],
  status: String (enum: 'planned', 'ongoing', 'completed'),
  createdAt: Date
}
```

## API Endpoints

**Authentication Routes**
- POST /api/auth/register - Create new user account
- POST /api/auth/login - Authenticate user and issue JWT
- GET /api/auth/profile - Retrieve authenticated user profile

**Trip Routes**
- POST /api/trips - Create new trip (protected)
- GET /api/trips/my-trips - Retrieve user's trips (protected)
- GET /api/trips/featured - Get featured trips (public)
- GET /api/trips/:id - Get specific trip details (protected)
- PUT /api/trips/:id - Update trip information (protected)
- DELETE /api/trips/:id - Delete trip (protected)

**Admin Routes**
- GET /api/admin/trips - Retrieve all trips (admin only)
- GET /api/admin/users - Retrieve all users (admin only)
- PATCH /api/admin/trips/:id/featured - Toggle featured status (admin only)
- DELETE /api/admin/users/:id - Delete user account (admin only)
- GET /api/admin/stats - Retrieve system statistics (admin only)

## Security Implementation

**Password Security**
- Passwords hashed using bcryptjs with salt rounds before database storage
- Plaintext passwords never stored or transmitted
- Password comparison uses secure hashing algorithms

**Authentication & Authorization**
- JWT tokens contain user ID and role information
- Tokens validated on every protected route request
- Role-based middleware restricts admin endpoints to administrators only
- Tokens expire after defined duration, requiring re-authentication

**Data Protection**
- CORS configuration prevents unauthorized cross-origin requests
- Environment variables store sensitive data (JWT secret, database URI)
- Protected routes prevent unauthorized data access

## Project Structure

```
Journey-Junction/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   └── adminController.js
│   ├── models/                   # Data schemas
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── admin.js
│   ├── middleware/auth.js        # JWT verification
│   ├── server.js                 # Express app setup
│   └── package.json
│
└── journey-junction/             # Frontend
    ├── src/
    │   ├── components/           # Reusable UI components
    │   │   ├── Navbar.js
    │   │   └── PrivateRoute.js
    │   ├── pages/                # Page components
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── PlanTrip.js
    │   │   ├── FeaturedTrips.js
    │   │   └── AdminPanel.js
    │   ├── services/api.js       # Axios configuration
    │   ├── context/              # State management
    │   │   └── AuthContext.js
    │   ├── App.js                # Main component
    │   └── index.js              # Entry point
    └── package.json
```

## Development Workflow

**Setup Process**
1. Clone repository and navigate to backend directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file
4. Start MongoDB service
5. Run backend: `npm run dev`
6. Navigate to frontend directory and start React: `npm start`

**Environment Configuration**
- PORT: Backend server port (default: 5000)
- MONGODB_URI: Database connection string
- JWT_SECRET: Secret key for token signing
- NODE_ENV: Development or production mode

## Future Enhancement Opportunities

- Image upload functionality with cloud storage integration
- Trip sharing and collaboration features
- User comments and ratings on featured trips
- Detailed itinerary planning with day-by-day activities
- Budget tracking and expense management
- Map integration for destination visualization
- Email notifications for trip updates
- Social media sharing capabilities
- Payment integration for premium features

## Conclusion

Journey Junction demonstrates a complete full-stack web application implementing modern development practices including RESTful API design, JWT authentication, role-based access control, and responsive UI design. The modular architecture enables easy maintenance and scalability for future enhancements.
