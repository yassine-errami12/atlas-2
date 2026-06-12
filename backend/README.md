# Atlas Tech Backend API

A production-ready Node.js/Express backend for the Atlas Tech Bazaar e-commerce platform. Built with TypeScript, MongoDB, JWT authentication, and comprehensive validation.

## Features

- ✅ **User Authentication**: Register, login with JWT tokens, demo accounts
- ✅ **Product Management**: CRUD operations with category and brand filtering
- ✅ **Shopping Cart Integration**: Order creation and management
- ✅ **Order Management**: Full order lifecycle with status tracking (pending, shipped, delivered)
- ✅ **Reviews System**: Product reviews with rating aggregation
- ✅ **Admin Dashboard**: User management, order tracking, product management
- ✅ **Role-Based Access**: User and admin roles with protected routes
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **Security**: Password hashing with bcryptjs, JWT authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd backend
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/atlas-tech
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
```

3. **Start MongoDB**

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local MongoDB
mongod
```

4. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically seed the database with initial data.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user's orders
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Reviews

- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (authenticated)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Users

- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user details (admin only)

## Demo Accounts

After seeding, you can use:

**Admin:**
- Email: `admin@atlas.ma`
- Password: `admin123`

**User:**
- Email: `user@atlas.ma`
- Password: `user1234`

## Scripts

```bash
# Development
npm run dev

# Build for production
npm build

# Start production server
npm start

# Seed database
npm run seed

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models/schemas
│   ├── routes/          # API route handlers
│   ├── scripts/         # Utility scripts (seed, migrations)
│   ├── utils/           # Helper functions
│   ├── middleware/
│   │   ├── auth.ts      # JWT authentication
│   │   ├── errorHandler.ts
│   │   └── types.ts
│   └── index.ts         # Application entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage/storage
4. Client includes token in Authorization header: `Authorization: Bearer <token>`
5. Protected routes validate token before processing request

## Data Models

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  price: number,
  category: Category,
  brand: Brand,
  stock: number,
  image: string,
  rating: number,
  reviewsCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```typescript
{
  _id: ObjectId,
  userId: ObjectId | null,
  customer: {
    name: string,
    phone: string,
    address: string,
    city: string
  },
  items: Array<{
    productId: ObjectId,
    title: string,
    price: number,
    image: string,
    quantity: number
  }>,
  total: number,
  status: 'pending' | 'shipped' | 'delivered',
  paymentMethod: 'COD',
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```typescript
{
  _id: ObjectId,
  productId: ObjectId,
  userId: ObjectId,
  author: string,
  rating: number (1-5),
  comment: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Validation

All inputs are validated using Zod schemas in `src/utils/validation.ts`. Requests with invalid data are rejected with a 400 status code.

## CORS

CORS is enabled for the frontend URL specified in `FRONTEND_URL` environment variable. Credentials are allowed.

## Development

To run in development mode with hot reload:

```bash
npm run dev
```

The server will watch for file changes and automatically restart.

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set production environment variables:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
FRONTEND_URL=your-production-frontend-url
```

3. Start the server:
```bash
npm start
```

## Docker

Build and run with Docker:

```bash
docker build -t atlas-tech-backend .
docker run -p 3000:3000 --env-file .env atlas-tech-backend
```

## Security Considerations

- **Passwords**: All passwords are hashed using bcryptjs with 10 salt rounds
- **Authentication**: JWT tokens are used for stateless authentication
- **Authorization**: Role-based access control on sensitive operations
- **Validation**: All inputs are validated using Zod schemas
- **CORS**: Restricted to configured frontend URL
- **Error Messages**: Generic error messages to prevent information leakage

## License

MIT

## Support

For issues and questions, please open an issue in the GitHub repository.
