# Frontend Integration Guide

This guide explains how to integrate the backend API with the Atl Tech frontend application. The frontend is already structured to work with this backend, but you may want to understand or modify the integration points.

## Base URL Configuration

The frontend expects the backend to run on `http://localhost:3000` in development.

To change the API base URL, modify your frontend environment configuration.

## Authentication Flow

### 1. Registration

Register a new user account:

```typescript
// Frontend sends registration request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Backend responds with user and token
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}

// Frontend stores token in localStorage or Zustand store
// Frontend redirects to dashboard/home page
```

### 2. Login

Authenticate existing user:

```typescript
// Frontend sends login request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

// Backend responds with user and token
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}

// Frontend stores token and either:
// - Stores in localStorage for persistence
// - Or stores in Zustand store for session
// Frontend sets up authenticated requests with this token
```

### 3. Authenticated Requests

For all protected requests, include JWT token in Authorization header:

```typescript
const token = localStorage.getItem('auth_token'); // Or from your store

fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## Suggested Frontend Integration Points

### 1. Environment Setup

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FRONTEND_URL=http://localhost:5173
```

### 2. API Service Layer (Optional Enhancement)

Create a new file `src/services/api.ts` in the frontend:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiCall = async (
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};
```

### 3. Update Auth Store

Modify `src/store/auth.ts` to use the backend:

```typescript
// Instead of local-only authentication, make API calls
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... existing code ...
      
      register: async (name, email, password) => {
        try {
          const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
          
          set({ 
            user: response.user,
            token: response.token 
          });
          
          return { ok: true };
        } catch (error) {
          return { 
            ok: false, 
            error: error.message 
          };
        }
      },
      
      login: async (email, password) => {
        try {
          const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          
          set({ 
            user: response.user,
            token: response.token 
          });
          
          return { ok: true };
        } catch (error) {
          return { 
            ok: false, 
            error: error.message 
          };
        }
      },
    }),
    { name: 'atlas-auth' }
  )
);
```

### 4. Update Product Store

Modify `src/store/products.ts` to fetch from backend:

```typescript
export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      reviews: [],

      // Initialize by fetching from backend
      initializeProducts: async () => {
        try {
          const products = await apiCall('/products');
          set({ products });
        } catch (error) {
          logger.error('Failed to fetch products:', error);
        }
      },

      addProduct: async (p) => {
        const token = // get token from auth store
        try {
          const response = await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(p),
          }, token);
          
          set((s) => ({
            products: [...s.products, response],
          }));
        } catch (error) {
          logger.error('Failed to add product:', error);
        }
      },

      // ... similar for update and delete
    }),
    { name: 'atlas-products' }
  )
);
```

### 5. Update Order Store

Modify `src/store/orders.ts` to use backend:

```typescript
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      create: async (o) => {
        try {
          const response = await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(o),
          });
          
          const order = {
            ...o,
            id: response.id,
            status: 'pending',
            paymentMethod: 'COD',
            createdAt: new Date().toISOString(),
          };
          
          set((s) => ({ orders: [order, ...s.orders] }));
          return order;
        } catch (error) {
          logger.error('Failed to create order:', error);
          throw error;
        }
      },

      // ... similar for other operations
    }),
    { name: 'atlas-orders' }
  )
);
```

## API Response Mapping

### Products Response

The backend returns products with this structure:

```json
{
  "_id": "mongo_object_id",
  "title": "Product Name",
  "description": "Description",
  "price": 599,
  "category": "Audio",
  "brand": "Atlas",
  "stock": 42,
  "image": "https://...",
  "rating": 4.6,
  "reviewsCount": 128,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

The frontend expects `id` instead of `_id`, so you may need to map:

```typescript
const product = {
  id: response._id,
  ...response
}
```

### Orders Response

The backend returns:

```json
{
  "id": "order_id",
  "_id": "mongo_object_id",
  "userId": "user_id",
  "customer": {
    "name": "...",
    "phone": "...",
    "address": "...",
    "city": "..."
  },
  "items": [...],
  "total": 599,
  "status": "pending",
  "paymentMethod": "COD",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Demo Account Credentials

After starting the backend, use these credentials:

- **Admin**: admin@atlas.ma / admin123
- **User**: user@atlas.ma / user1234

## Development Workflow

1. Start the MongoDB server:
   ```bash
   docker run -d -p 27017:27017 mongo
   ```

2. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## Environment Variables

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend `.env`

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/atlas-tech
JWT_SECRET=your-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
FRONTEND_URL=http://localhost:5173
```

## Error Handling

The backend returns consistent error responses. Handle them in the frontend:

```typescript
try {
  const result = await apiCall(endpoint, options);
} catch (error) {
  // error.message contains the error message from the backend
  toast.error(error.message);
}
```

## CORS Configuration

The backend allows requests from `http://localhost:5173` by default. To change this, modify `FRONTEND_URL` in the backend `.env`.

## Testing with Demo Account

1. Login with `admin@atlas.ma` / `admin123`
2. Navigate to `/admin/products` to manage products
3. Navigate to `/admin/orders` to manage orders
4. Login with `user@atlas.ma` / `user1234`
5. Browse products and create orders

## Production Considerations

Before deploying to production:

1. Update all environment variables with production values
2. Set `NODE_ENV=production`
3. Enable HTTPS (no HTTP in production)
4. Set a strong JWT_SECRET
5. Use MongoDB Atlas or self-hosted MongoDB with authentication
6. Set up proper CORS for your production frontend URL
7. Implement rate limiting
8. Set up monitoring and logging
9. Use environment-based configuration
10. Keep dependencies updated

## Troubleshooting

### "Cannot POST /api/auth/login"

- Ensure backend is running on port 3000
- Check `FRONTEND_URL` in backend `.env` includes your frontend URL

### "Invalid token" error

- Ensure Authorization header format is correct: `Bearer <token>`
- Check JWT token is not expired
- Verify JWT_SECRET matches between requests

### MongoDB connection error

- Ensure MongoDB is running on port 27017
- Check `MONGODB_URI` is correct in `.env`
- Try connecting directly: `mongo mongodb://localhost:27017`

### CORS errors

- Check backend CORS configuration
- Verify `FRONTEND_URL` environment variable
- Ensure requests include `Content-Type: application/json` header

## Support

For issues with the integration, check:

1. Backend logs (check for errors in console)
2. Frontend browser console (check for network errors)
3. Backend API_DOCUMENTATION.md for endpoint details
4. README.md in both frontend and backend directories
