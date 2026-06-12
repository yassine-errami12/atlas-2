# Admin Dashboard Authentication Guide

## Overview

The Admin Dashboard features a secure authentication system with the following components:

- **Admin Login Page** (`/admin/login`) - Secure login interface for admins only
- **Admin Dashboard** (`/admin/dashboard`) - Main admin dashboard with analytics and overview
- **Protected Routes** - All admin routes require authentication
- **Session Management** - 24-hour session with automatic timeout
- **Backend Integration** - Ready for production with JWT token authentication

## Architecture

### Frontend Components

#### 1. Admin Login Page (`frontend/src/routes/admin.login.tsx`)
- Email/password authentication
- Admin role verification
- Secure credential validation
- Demo credentials display for testing
- Error handling and user feedback

#### 2. Admin Dashboard (`frontend/src/routes/admin.dashboard.tsx`)
- Overview of key metrics
- Product analytics (total, stock, inventory value)
- Customer reviews statistics
- Top products by rating
- Most reviewed products
- Real-time statistics

#### 3. Admin Layout (`frontend/src/routes/admin.tsx`)
- Protected route wrapper
- Navigation tabs for admin sections
- User profile display
- Logout functionality
- Request authentication on load

#### 4. Admin Auth Store (`frontend/src/store/admin-auth.ts`)
- Session management
- Token storage
- Session timeout tracking (24 hours)
- Secure local storage

### Backend Routes

#### Admin Login Endpoint
```
POST /api/admin/login
```

**Request:**
```json
{
  "email": "admin@atlas.ma",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "userId",
    "name": "Admin Atlas",
    "email": "admin@atlas.ma",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

#### Admin Verification Endpoint
```
GET /api/admin/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "userId",
    "email": "admin@atlas.ma",
    "role": "admin"
  }
}
```

## User Flow

### 1. Accessing the Admin Dashboard

```
User accesses /admin
    ↓
Check if authenticated
    ↓ (No)
Redirect to /admin/login
    ↓ (Yes)
Check if admin role
    ↓ (No)
Redirect to /admin/login
    ↓ (Yes)
Load dashboard
```

### 2. Login Process

```
User fills credentials
    ↓
Submit form to /admin/login
    ↓
Validate email/password
    ↓ (Invalid)
Show error message
    ↓ (Valid)
Check admin role
    ↓ (Not admin)
Show "Admin access required" error
    ↓ (Admin)
Store authentication token
    ↓
Redirect to /admin/dashboard
```

### 3. Session Management

```
User logs in
    ↓
Session created with 24-hour timeout
    ↓
Token stored in localStorage
    ↓
Session metadata stored (loginTime, adminEmail, etc.)
    ↓ (Session valid)
Allow dashboard access
    ↓ (Session expired)
Redirect to /admin/login
    ↓ (User logs out)
Clear session & redirect to /admin/login
```

## Security Features

### 1. Protected Routes
- All admin routes require authentication check
- Automatic redirection to login if not authenticated
- Role verification ensures only admins can access

### 2. Token Management
- JWT tokens issued on successful login
- Tokens stored securely in localStorage
- 24-hour session timeout
- Session expiry checked on app load

### 3. Admin Role Verification
- Backend verifies admin role on every request
- Frontend prevents unauthorized access
- Clear error messages for permission denied

### 4. Password Hashing
- Passwords hashed using bcrypt on backend
- Raw passwords never transmitted in plain text
- Secure password comparison on authentication

### 5. CORS Protection
- API configured with specific origin
- Credentials validation enabled
- Cross-origin requests properly handled

## Demo Credentials

**Email:** `admin@atlas.ma`  
**Password:** `admin123`

These credentials are pre-seeded for demonstration purposes.

## API Integration Examples

### Frontend: Login Request
```typescript
// Using the existing auth store
import { useAuthStore } from "@/store/auth";

const { login } = useAuthStore();
const result = login("admin@atlas.ma", "admin123");

if (result.ok) {
  // Redirect to dashboard
  navigate({ to: "/admin/dashboard" });
} else {
  // Show error
  toast.error(result.error);
}
```

### Backend: Protected Admin Endpoint
```typescript
import { adminOnly } from '../middleware/auth';

router.get('/protected-route', adminOnly, async (req: AuthRequest, res: Response) => {
  // Only admins can access this route
  const adminId = req.userId;
  // ... handle request
});
```

### Backend: Token Verification
```typescript
import { authenticate } from '../middleware/auth';

router.get('/verify', authenticate, async (req: AuthRequest, res: Response) => {
  // Any authenticated user can access
  const userId = req.userId;
  // ... handle request
});
```

## Deployment Considerations

### Production Setup

1. **Environment Variables**
   ```
   JWT_SECRET=your-secure-secret-key-min-32-chars
   FRONTEND_URL=https://yourdomain.com
   API_URL=https://api.yourdomain.com
   ```

2. **Session Storage**
   - Consider moving from localStorage to httpOnly cookies for enhanced security
   - Update store to use cookie-based session management

3. **Token Refresh**
   - Implement token refresh mechanism for long sessions
   - Add refresh token endpoint: `POST /api/admin/refresh`

4. **Rate Limiting**
   - Add rate limiting to `/api/admin/login` endpoint
   - Prevent brute force attacks

5. **Logging & Monitoring**
   - Log all admin login attempts
   - Monitor failed login attempts
   - Alert on suspicious activities

6. **HTTPS Only**
   - Enforce HTTPS for all admin routes
   - Set secure flag on authentication cookies

## Troubleshooting

### Issue: "Admin access required" error
- Verify user account has admin role in database
- Check backend User model role field
- Ensure login credentials are for admin account

### Issue: Session expires unexpectedly
- Check 24-hour timeout setting in `admin-auth.ts`
- Verify system time is synchronized
- Look for localStorage clearing in browser

### Issue: Login page keeps redirecting
- Check if user is already authenticated
- Clear browser cache and localStorage
- Verify JWT token validity

### Issue: API endpoint returns 401
- Ensure JWT_SECRET environment variable is set
- Verify token is included in Authorization header
- Check token hasn't expired

## File Structure

```
frontend/
├── src/
│   ├── routes/
│   │   ├── admin.tsx              # Admin layout & protection
│   │   ├── admin.login.tsx        # Login page
│   │   ├── admin.dashboard.tsx    # Dashboard
│   │   ├── admin.products.tsx     # Products management
│   │   ├── admin.orders.tsx       # Orders management
│   │   └── admin.users.tsx        # Users management
│   └── store/
│       ├── auth.ts                # Main auth store
│       └── admin-auth.ts          # Admin-specific auth

backend/
├── src/
│   ├── routes/
│   │   ├── admin.ts               # Admin API endpoints
│   │   └── auth.ts                # General auth endpoints
│   ├── middleware/
│   │   └── auth.ts                # JWT verification
│   └── index.ts                   # Route registration
```

## Next Steps

1. **Test the Authentication**
   - Navigate to `/admin/login`
   - Login with demo credentials
   - Verify dashboard loads
   - Test logout functionality

2. **Customize Admin Sections**
   - Add more admin routes as needed
   - Implement additional admin features
   - Update navigation tabs

3. **Production Hardening**
   - Implement rate limiting
   - Add HTTPS enforcement
   - Move to httpOnly cookies
   - Add session refresh mechanism

4. **Monitoring & Analytics**
   - Track admin login/logout
   - Monitor authentication failures
   - Audit admin actions
