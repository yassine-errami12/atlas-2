# Atlas Tech Bazaar - Backend Complete Reference

## Overview

A production-ready Express.js/TypeScript backend for the Atlas Tech Bazaar e-commerce platform. The backend is fully compatible with the existing frontend and provides complete API coverage for all features.

## ✅ What's Included

### Core Features
- **User Management**: Registration, login, JWT authentication
- **Product Management**: CRUD operations with filtering by category/brand
- **Shopping & Orders**: Full order lifecycle management
- **Reviews System**: Product reviews with automatic rating calculation
- **Admin Dashboard**: Complete admin controls for users, orders, and products
- **Role-Based Access Control**: User vs Admin authorization

### Technical Features
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT authentication with secure token generation
- Password hashing with bcryptjs
- Input validation with Zod schemas
- CORS configured for frontend
- Comprehensive error handling
- Automatic database seeding
- Development and production configurations
- Docker & Docker Compose support
- ESLint & Prettier for code quality

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection & initialization
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication & admin checks
│   │   ├── errorHandler.ts          # Error handling & 404
│   │   └── types.ts                 # TypeScript type definitions
│   ├── models/
│   │   ├── User.ts                  # User schema/model
│   │   ├── Product.ts               # Product schema/model
│   │   ├── Order.ts                 # Order schema/model
│   │   └── Review.ts                # Review schema/model
│   ├── routes/
│   │   ├── auth.ts                  # Auth endpoints
│   │   ├── products.ts              # Product endpoints
│   │   ├── orders.ts                # Order endpoints
│   │   ├── reviews.ts               # Review endpoints
│   │   └── users.ts                 # User endpoints
│   ├── utils/
│   │   ├── logger.ts                # Logging utility
│   │   ├── jwt.ts                   # JWT generation & verification
│   │   ├── password.ts              # Password hashing & comparison
│   │   └── validation.ts            # Zod validation schemas
│   ├── scripts/
│   │   └── seed.ts                  # Database seeding script
│   └── index.ts                     # Application entry point
│
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore patterns
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── prettier.config.js               # Code formatting config
├── eslint.config.js                 # Linting config
├── Dockerfile                       # Docker build configuration
├── docker-compose.yml               # Docker Compose setup
├── Makefile                         # Make commands for convenience
│
├── README.md                        # Backend documentation
├── API_DOCUMENTATION.md             # Complete API reference
└── INTEGRATION_GUIDE.md             # Frontend integration guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm/yarn

### Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start MongoDB (if not running)
docker run -d -p 27017:27017 mongo

# Start development server
npm run dev
```

Backend will be available at `http://localhost:3000`

## 📊 API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (auth required)

### Products (Public read, Admin write)
- `GET /api/products` - List all
- `GET /api/products/:id` - Get one
- `GET /api/products/category/:category` - Filter by category
- `POST /api/products` - Create (admin)
- `PUT /api/products/:id` - Update (admin)
- `DELETE /api/products/:id` - Delete (admin)

### Orders (Public create, Admin read/update)
- `POST /api/orders` - Create order
- `GET /api/orders` - List all (admin)
- `GET /api/orders/:id` - Get details
- `GET /api/orders/user/:userId` - User's orders
- `PATCH /api/orders/:id/status` - Update status (admin)
- `DELETE /api/orders/:id` - Delete (admin)

### Reviews (Auth required)
- `GET /api/reviews/product/:productId` - Get reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Users (Admin only)
- `GET /api/users` - List all
- `GET /api/users/:id` - Get one

## 🔐 Authentication

### Flow
1. User registers/logs in
2. Backend validates credentials
3. Backend returns JWT token
4. Client includes token in `Authorization: Bearer <token>` header for protected routes

### Demo Accounts
```
Admin:  admin@atlas.ma / admin123
User:   user@atlas.ma / user1234
```

## 💾 Database Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### Product
```typescript
{
  title: string
  description: string
  price: number (MAD)
  category: 'Audio' | 'Wearables' | 'Charge' | 'Accessoires' | 'Gaming'
  brand: 'Atlas' | 'Sahara' | 'MedinaTech' | 'Argan' | 'Casablanca'
  stock: number
  image: string (URL)
  rating: number (0-5)
  reviewsCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Order
```typescript
{
  userId: ObjectId | null (guest orders allowed)
  customer: {
    name: string
    phone: string
    address: string
    city: string
  }
  items: [{
    productId: ObjectId
    title: string
    price: number
    image: string
    quantity: number
  }]
  total: number
  status: 'pending' | 'shipped' | 'delivered'
  paymentMethod: 'COD' (cash on delivery)
  createdAt: Date
  updatedAt: Date
}
```

### Review
```typescript
{
  productId: ObjectId
  userId: ObjectId
  author: string
  rating: number (1-5)
  comment: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database manually
npm run seed

# Run linting
npm run lint

# Format code
npm run format

# Run tests (if configured)
npm run test
```

## 🐳 Docker Usage

### Docker Compose (Recommended)

```bash
# Start backend + MongoDB
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Manual Docker

```bash
# Build image
docker build -t atlas-tech-backend .

# Run container
docker run -p 3000:3000 --env-file .env atlas-tech-backend
```

## ✨ Key Features Detailed

### 1. Automatic Database Seeding
- Database is automatically seeded on first run
- Includes 2 demo users and 8 sample products
- Creates basic reviews for products

### 2. Input Validation
- All endpoints validate input using Zod schemas
- Returns `400 Bad Request` with validation details on invalid input
- Type-safe validation with TypeScript

### 3. Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging

### 4. Security
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens for stateless authentication
- Role-based access control
- CORS configured for frontend URL
- Input sanitization and validation

### 5. Logging
- Structured logging with timestamps and log levels
- Configurable log level via environment
- Color-coded console output for development

### 6. Database Integration
- MongoDB with Mongoose ODM
- Automatic schema validation
- Indexed queries for performance
- Support for local or MongoDB Atlas

## 🌐 Environment Configuration

### Development (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/atlas-tech
JWT_SECRET=your-dev-secret
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug
```

### Production (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@host/dbname
JWT_SECRET=your-very-strong-production-secret
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
```

## 📝 Frontend Integration

The frontend can integrate with this backend by:

1. Updating API calls to point to `http://localhost:3000/api`
2. Using the `/auth/login` and `/auth/register` endpoints
3. Including JWT token in Authorization header for protected requests
4. Mapping response fields (e.g., `_id` → `id`)

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration steps.

## 🧪 Testing the API

### With cURL

```bash
# Health check
curl http://localhost:3000/health

# List products
curl http://localhost:3000/api/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@atlas.ma","password":"user1234"}'

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer":{"name":"John","phone":"+212612345678","address":"Street","city":"City"},
    "items":[{"productId":"...","title":"...","price":599,"image":"...","quantity":1}],
    "total":599
  }'
```

### With REST Client Extension

Use VS Code REST Client extension to test endpoints defined in `.http` files.

## 🔗 Related Documentation

- **[README.md](./README.md)** - Backend overview and features
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - How to integrate with frontend
- **[SETUP_INSTRUCTIONS.md](../SETUP_INSTRUCTIONS.md)** - Full project setup guide
- **[Frontend README](../frontend/README.md)** - Frontend documentation

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `cors` - CORS middleware
- `dotenv` - Environment configuration

### Development
- `typescript` - Type checking
- `tsx` - TypeScript executor
- `eslint` - Code linting
- `prettier` - Code formatting
- `vitest` - Testing framework

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running on port 27017
docker run -d -p 27017:27017 mongo
```

### Port 3000 Already in Use
```
Solution: Change PORT in .env or kill the process using port 3000
```

### Module Not Found Errors
```
Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Production Checklist

- [ ] Update `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB with authentication
- [ ] Set proper `FRONTEND_URL`
- [ ] Enable HTTPS
- [ ] Set `LOG_LEVEL=info`
- [ ] Run `npm run build`
- [ ] Test thoroughly before deployment
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📈 Performance Considerations

- Queries are optimized with indexes
- Response caching can be added at route level
- Consider implementing Redis for session caching
- Database connection pooling enabled by default
- Enable compression middleware for production

## 🛠️ Future Enhancements

- [ ] Add email notifications
- [ ] Implement payment gateway integration
- [ ] Add rate limiting
- [ ] Database migrations system
- [ ] Webhook support
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Inventory management
- [ ] Shipping integration

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs for errors
4. Verify environment configuration

## 📄 License

MIT

---

**Backend Version**: 1.0.0  
**Last Updated**: 2024  
**Compatible With**: Frontend v1.0.0+
