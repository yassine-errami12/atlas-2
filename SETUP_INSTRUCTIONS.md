# Setup Instructions

This guide provides step-by-step instructions for setting up and running the complete Atlas Tech Bazaar application with both frontend and backend.

## Prerequisites

- **Node.js**: Version 16 or higher ([download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **MongoDB**: Version 4.4 or higher
  - Option 1: [Install locally](https://docs.mongodb.com/manual/installation/)
  - Option 2: Use Docker (recommended): `docker run -d -p 27017:27017 mongo`
- **Git**: For cloning the repository ([download](https://git-scm.com/))

## Quick Start

### 1. Setup Database

**Option A: Using Docker (Recommended)**

```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local MongoDB**

```bash
# Make sure mongod is running
mongod
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server with auto-seeding
npm run dev
```

The server will start on `http://localhost:3000` and automatically seed the database with initial data.

**Verify Backend is Running:**

Visit `http://localhost:3000/health` in your browser. You should see:

```json
{"status":"ok","timestamp":"2024-01-01T00:00:00Z"}
```

### 3. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Click "Connexion" (Login) or "Inscription" (Register)
3. Use demo account:
   - Email: `admin@atlas.ma`
   - Password: `admin123`

Or register a new account.

## Project Structure

```
project-root/
├── frontend/                 # React/TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── routes/          # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── data/            # Data definitions
│   │   └── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                  # Node.js/Express backend
    ├── src/
    │   ├── routes/          # API route handlers
    │   ├── models/          # MongoDB schemas
    │   ├── middleware/      # Express middleware
    │   ├── utils/           # Helper functions
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## Common Commands

### Backend

```bash
cd backend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database (if not auto-seeded)
npm run seed

# Code linting
npm run lint

# Format code
npm run format
```

### Frontend

```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Code linting
npm run lint
```

## Using Docker Compose

For easier setup with Docker:

```bash
cd backend

# Build and start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

## Makefile Commands (Backend)

If you prefer using `make`:

```bash
cd backend

# Show all available commands
make help

# Install dependencies
make install

# Start development
make dev

# Build for production
make build

# Start production server
make start

# Seed database
make seed

# Run linting
make lint

# Format code
make format

# Setup with automatic seeding
make setup
```

## Environment Configuration

### Backend `.env` File

Copy `.env.example` to `.env` and update:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/atlas-tech

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Important for Production

In production, you **must** update:
- `JWT_SECRET` - Use a strong random string
- `MONGODB_URI` - Use production MongoDB connection
- `FRONTEND_URL` - Use your production frontend URL
- `NODE_ENV` - Set to "production"

## Demo Accounts

After setup, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@atlas.ma` | `admin123` |
| User | `user@atlas.ma` | `user1234` |

You can also create new accounts by registering.

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError`

**Solution**:
1. Verify MongoDB is running: `mongo` or Docker container is active
2. Check `MONGODB_URI` in `.env` is correct
3. Try connecting to MongoDB directly

### Backend won't start

**Error**: `Address already in use :::3000`

**Solution**:
1. Kill process using port 3000: `lsof -i :3000` then `kill -9 <PID>`
2. Or change `PORT` in `.env` to a different port

### Frontend can't connect to backend

**Error**: `CORS error` or `Failed to fetch`

**Solution**:
1. Ensure backend is running: `http://localhost:3000/health`
2. Check `FRONTEND_URL` in backend `.env` matches your frontend URL
3. Check browser console for specific error message

### Database shows empty after restart

**Expected**: Database is seeded only once on first run
**To reseed**: Run `npm run seed` in backend directory

### Out of memory error

**Solution**:
1. Close other applications
2. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run dev`

## Next Steps

1. **Explore the UI**:
   - Browse products in `/shop`
   - Add items to cart
   - Create an order (COD payment)
   - Leave product reviews

2. **Admin Features** (login as admin):
   - Manage products in `/admin/products`
   - View orders in `/admin/orders`
   - View users in `/admin/users`

3. **API Documentation**:
   - See [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for detailed API reference
   - See [INTEGRATION_GUIDE.md](./backend/INTEGRATION_GUIDE.md) for frontend integration details

4. **Development**:
   - Backend source in `backend/src/`
   - Frontend source in `frontend/src/`
   - Both use TypeScript for type safety

## Performance Tips

1. **Database Indexing**:
   - Backend automatically creates indexes on common fields
   - For large datasets, consider adding more indexes

2. **Image Optimization**:
   - Current implementation uses image URLs
   - Consider implementing image caching/CDN in production

3. **API Caching**:
   - Products list could be cached on frontend
   - Consider implementing Redis caching in backend for production

4. **Bundle Size**:
   - Frontend production build is optimized by Vite
   - Monitor bundle size: `npm run build`

## Additional Resources

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Integration Guide](./backend/INTEGRATION_GUIDE.md)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Router Documentation](https://tanstack.com/router/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README files in both directories
3. Check backend logs for error messages
4. Check browser DevTools console for frontend errors

## Security Checklist for Production

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable HTTPS for all endpoints
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS for your domain
- [ ] Use `MONGODB_URI` with authentication
- [ ] Set up HTTPS certificates
- [ ] Enable helmet.js for security headers
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security audits and updates
- [ ] Hide error details in production

Enjoy building with Atlas Tech Bazaar! 🚀
