# Quick Start Guide - Journey Junction

## Start the Application (Both Frontend & Backend)

### Terminal 1 - Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### Terminal 2 - Frontend React App

```bash
cd journey-junction
npm start
```

Frontend runs on: http://localhost:3000

## First Time Setup

1. **Install MongoDB** (if not installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

3. **Configure Backend**:
   - Update `backend/.env` with your MongoDB URI
   - Change JWT_SECRET to a secure random string

4. **Open Browser**:
   - Go to http://localhost:3000
   - Register a new account
   - Start planning trips!

## Create Admin User

After registering a normal user, run this in MongoDB shell:

```bash
mongosh
use journey-junction
db.users.updateOne({email: "youremail@example.com"}, {$set: {role: "admin"}})
```

## Default Test Credentials (After Manual Creation)

You can create test accounts:
- **Regular User**: user@test.com / password123
- **Admin User**: admin@test.com / admin123

Remember to create these accounts through the registration page first, then update the admin role in MongoDB.

## Common Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Verify Installation

1. Backend: Visit http://localhost:5000 - Should see: `{"message": "Journey Junction API"}`
2. Frontend: Visit http://localhost:3000 - Should see login page
3. MongoDB: Run `mongosh` and `show dbs` - Should see connection

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.
