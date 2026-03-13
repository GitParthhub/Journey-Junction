# Journey Junction - Trip Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing and planning trips.

## Features

### User Features
- **Authentication**: Register and login with JWT-based authentication
- **Dashboard**: View all your planned trips
- **Plan Trip**: Create, edit, and delete trips with details like destination, dates, budget, activities
- **Featured Trips**: Browse trips featured by admins from the community

### Admin Features
- **Admin Panel**: Manage all trips and users
- **Statistics Dashboard**: View system statistics (total users, trips, etc.)
- **Feature Trips**: Mark trips as featured to showcase them
- **User Management**: View and delete users

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router DOM for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Project Structure

```
Journey-Junction/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── journey-junction/ (Frontend)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── PrivateRoute.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── PlanTrip.js
    │   │   ├── FeaturedTrips.js
    │   │   └── AdminPanel.js
    │   ├── services/
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/journey-junction
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd journey-junction
```

2. Dependencies are already installed. If not, run:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

### Creating Your First Account

1. Open `http://localhost:3000` in your browser
2. Click "Don't have an account? Register"
3. Fill in your name, email, and password
4. Click "Register"

### Creating an Admin Account

To create an admin user, you need to manually update the database:

1. Register a normal user account first
2. Connect to MongoDB:
```bash
mongosh
use journey-junction
db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
```

### Planning a Trip

1. Login to your account
2. Click "Plan New Trip" button on the dashboard
3. Fill in trip details:
   - Title
   - Destination
   - Description
   - Start and End dates
   - Budget
   - Image URL (optional)
   - Activities (comma-separated)
   - Status (planned/ongoing/completed)
4. Click "Create Trip"

### Admin Features

1. Login with an admin account
2. Navigate to "Admin Panel"
3. View statistics, manage trips, and users
4. Toggle featured status on trips
5. Delete users if needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Trips
- `POST /api/trips` - Create trip (protected)
- `GET /api/trips/my-trips` - Get user's trips (protected)
- `GET /api/trips/featured` - Get featured trips
- `GET /api/trips/:id` - Get trip by ID (protected)
- `PUT /api/trips/:id` - Update trip (protected)
- `DELETE /api/trips/:id` - Delete trip (protected)

### Admin
- `GET /api/admin/trips` - Get all trips (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/trips/:id/featured` - Toggle featured status (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Get statistics (admin only)

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```

### Trip Model
```javascript
{
  title: String,
  destination: String,
  description: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  image: String,
  isFeatured: Boolean,
  userId: ObjectId (ref: User),
  activities: [String],
  status: String (enum: ['planned', 'ongoing', 'completed']),
  createdAt: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control (admin/user)
- CORS enabled for frontend-backend communication

## Future Enhancements

- Image upload functionality
- Trip sharing with other users
- Comments and ratings on featured trips
- Trip itinerary planning
- Budget tracking and expense management
- Map integration for destinations
- Email notifications
- Social media sharing

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

### Port Already in Use
- Change PORT in backend .env file
- Kill process using the port: `npx kill-port 5000`

### CORS Errors
- Ensure backend is running on port 5000
- Check API baseURL in frontend api.js

## License

MIT License

## Author

Journey Junction Team
