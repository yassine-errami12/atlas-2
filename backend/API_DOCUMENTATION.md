# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained from the `/auth/login` or `/auth/register` endpoints.

## Response Format

All responses are JSON. Error responses follow this format:

```json
{
  "error": "Error message"
}
```

## Endpoints

### Auth

#### Register

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400` - Invalid input or email already registered

---

#### Login

**POST** `/auth/login`

Authenticate and get a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `401` - Invalid credentials

---

#### Get Current User

**GET** `/auth/me`

Get the current authenticated user's information.

**Authorization:** Required

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found

---

### Products

#### List All Products

**GET** `/products`

Get all available products.

**Query Parameters:**
- None

**Response:** `200 OK`
```json
[
  {
    "_id": "product_id",
    "title": "Product Name",
    "description": "Product description",
    "price": 599,
    "category": "Audio",
    "brand": "Atlas",
    "stock": 42,
    "image": "https://example.com/image.jpg",
    "rating": 4.6,
    "reviewsCount": 128,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### Get Single Product

**GET** `/products/:id`

Get details of a specific product.

**Response:** `200 OK`
```json
{
  "_id": "product_id",
  "title": "Product Name",
  "description": "Product description",
  "price": 599,
  "category": "Audio",
  "brand": "Atlas",
  "stock": 42,
  "image": "https://example.com/image.jpg",
  "rating": 4.6,
  "reviewsCount": 128,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- `404` - Product not found

---

#### Get Products by Category

**GET** `/products/category/:category`

Get all products in a specific category.

**Path Parameters:**
- `category` - One of: `Audio`, `Wearables`, `Charge`, `Accessoires`, `Gaming`

**Response:** `200 OK`
```json
[
  {
    "_id": "product_id",
    "title": "Product Name",
    ...
  }
]
```

---

#### Create Product (Admin)

**POST** `/products`

Create a new product.

**Authorization:** Admin only

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description here",
  "price": 599,
  "category": "Audio",
  "brand": "Atlas",
  "stock": 42,
  "image": "https://example.com/image.jpg"
}
```

**Response:** `201 Created`
```json
{
  "_id": "product_id",
  "title": "New Product",
  ...
}
```

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Admin access required

---

#### Update Product (Admin)

**PUT** `/products/:id`

Update an existing product.

**Authorization:** Admin only

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "price": 699,
  "stock": 30
}
```

**Response:** `200 OK`
```json
{
  "_id": "product_id",
  "title": "Updated Title",
  ...
}
```

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Product not found

---

#### Delete Product (Admin)

**DELETE** `/products/:id`

Delete a product.

**Authorization:** Admin only

**Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Product not found

---

### Orders

#### Create Order

**POST** `/orders`

Create a new order.

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "phone": "+212612345678",
    "address": "123 Main St",
    "city": "Casablanca"
  },
  "items": [
    {
      "productId": "product_id",
      "title": "Product Name",
      "price": 599,
      "image": "https://example.com/image.jpg",
      "quantity": 1
    }
  ],
  "total": 599
}
```

**Response:** `201 Created`
```json
{
  "id": "order_id",
  "_id": "order_id",
  "userId": null,
  "customer": {
    "name": "John Doe",
    "phone": "+212612345678",
    "address": "123 Main St",
    "city": "Casablanca"
  },
  "items": [...],
  "total": 599,
  "status": "pending",
  "paymentMethod": "COD",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- `400` - Invalid input

---

#### List All Orders (Admin)

**GET** `/orders`

Get all orders in the system.

**Authorization:** Admin only

**Response:** `200 OK`
```json
[
  {
    "id": "order_id",
    ...
  }
]
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required

---

#### Get Single Order

**GET** `/orders/:id`

Get details of a specific order.

**Response:** `200 OK`
```json
{
  "id": "order_id",
  "userId": "user_id",
  "customer": {...},
  "items": [...],
  "total": 599,
  "status": "pending",
  "paymentMethod": "COD",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- `404` - Order not found

---

#### Get User Orders

**GET** `/orders/user/:userId`

Get all orders for a specific user.

**Authorization:** Required (users can only see their own orders)

**Response:** `200 OK`
```json
[
  {
    "id": "order_id",
    ...
  }
]
```

**Errors:**
- `401` - Not authenticated
- `403` - Cannot view other users' orders

---

#### Update Order Status (Admin)

**PATCH** `/orders/:id/status`

Update the status of an order.

**Authorization:** Admin only

**Request Body:**
```json
{
  "status": "shipped"
}
```

Valid statuses: `pending`, `shipped`, `delivered`

**Response:** `200 OK`
```json
{
  "id": "order_id",
  "status": "shipped",
  ...
}
```

**Errors:**
- `400` - Invalid status
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Order not found

---

#### Delete Order (Admin)

**DELETE** `/orders/:id`

Delete an order.

**Authorization:** Admin only

**Response:** `200 OK`
```json
{
  "message": "Order deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - Order not found

---

### Reviews

#### Get Product Reviews

**GET** `/reviews/product/:productId`

Get all reviews for a product.

**Response:** `200 OK`
```json
[
  {
    "id": "review_id",
    "productId": "product_id",
    "userId": "user_id",
    "author": "John Doe",
    "rating": 5,
    "comment": "Excellent product!",
    "date": "2024-01-01"
  }
]
```

---

#### Create Review

**POST** `/reviews`

Create a review for a product.

**Authorization:** Required

**Request Body:**
```json
{
  "productId": "product_id",
  "rating": 5,
  "comment": "This product is amazing!"
}
```

**Response:** `201 Created`
```json
{
  "id": "review_id",
  "productId": "product_id",
  "userId": "user_id",
  "author": "John Doe",
  "rating": 5,
  "comment": "This product is amazing!",
  "date": "2024-01-01"
}
```

**Errors:**
- `400` - Invalid input
- `401` - Not authenticated
- `404` - Product not found

---

#### Delete Review

**DELETE** `/reviews/:id`

Delete a review.

**Authorization:** Required (owner or admin)

**Response:** `200 OK`
```json
{
  "message": "Review deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Can only delete your own reviews (or admin)
- `404` - Review not found

---

### Users

#### List All Users (Admin)

**GET** `/users`

Get all users in the system.

**Authorization:** Admin only

**Response:** `200 OK`
```json
[
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
]
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required

---

#### Get Single User (Admin)

**GET** `/users/:id`

Get details of a specific user.

**Authorization:** Admin only

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "user"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Admin access required
- `404` - User not found

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 500 | Server Error - Internal server error |

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing rate limiting middleware.

## Pagination

Currently no pagination is implemented. For large datasets, consider implementing pagination in future versions.
