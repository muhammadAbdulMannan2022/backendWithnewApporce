# Authentication API

A secure authentication system with access tokens, refresh tokens, and email verification using HTTP-only cookies.

## Features

- ✅ **Email Verification with OTP** - 6-digit OTP sent to email for registration verification
- ✅ **Access Tokens** (15 minutes expiry) - Short-lived tokens for API access
- ✅ **Refresh Tokens** (7 days expiry) - Long-lived tokens for getting new access tokens
- ✅ **HTTP-Only Cookies** - Tokens stored in secure, HTTP-only cookies to prevent XSS attacks
- ✅ **Token Rotation** - Refresh tokens are rotated on each refresh for better security
- ✅ **Secure by Default** - HTTPS-only cookies in production, SameSite protection
- ✅ **Password Validation** - Minimum 8 characters required
- ✅ **Email Format Validation** - Ensures valid email addresses

📧 **For detailed OTP setup and usage, see [OTP_GUIDE.md](./OTP_GUIDE.md)**

## Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   **Important:** Make sure to add `JWT_REFRESH_SECRET` to your `.env` file:
   ```env
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
   ```

3. **Start the database:**
   ```bash
   docker compose up -d
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server:**
   ```bash
   yarn dev
   ```

## API Endpoints

### POST `/auth/register`
**Step 1:** Register a new user and send OTP to email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email. Please verify to complete registration.",
  "email": "user@example.com"
}
```

**Note:** Password must be at least 8 characters. An OTP will be sent to the provided email.

---

### POST `/auth/verify-otp`
**Step 2:** Verify OTP and complete registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Registration successful! Welcome aboard!",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Cookies Set:**
- `accessToken` (HTTP-only, 15 min)
- `refreshToken` (HTTP-only, 7 days)

---

### POST `/auth/resend-otp`
Resend OTP if it expired or wasn't received.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "New OTP sent to your email"
}
```

---

### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Cookies Set:**
- `accessToken` (HTTP-only, 15 min)
- `refreshToken` (HTTP-only, 7 days)

---

### POST `/auth/refresh`
Get new access and refresh tokens using the refresh token.

**Request:** No body needed (uses refresh token from cookies)

**Response:**
```json
{
  "message": "Tokens refreshed successfully"
}
```

**Cookies Updated:**
- `accessToken` (new token, 15 min)
- `refreshToken` (new token, 7 days)

---

### POST `/auth/logout`
Logout and invalidate tokens.

**Request:** No body needed

**Response:**
```json
{
  "message": "Logout successful"
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

---

### GET `/auth/me`
Get current user information (protected route example).

**Request:** No body needed (uses access token from cookies)

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-12-24T04:00:00.000Z"
  }
}
```

**Error Response (if token expired):**
```json
{
  "message": "Invalid or expired access token"
}
```

## Client-Side Usage

### Making Requests

When making requests from the client (e.g., React, Next.js), you need to include credentials:

```javascript
// Using fetch
fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: This sends cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Using axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true // Important: This sends cookies
});

await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### Handling Token Expiration

When the access token expires, the API will return a 401 error with code `TOKEN_EXPIRED`. Your client should then call the `/auth/refresh` endpoint to get new tokens:

```javascript
// Axios interceptor example
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Security Features

1. **HTTP-Only Cookies**: Tokens are stored in HTTP-only cookies, making them inaccessible to JavaScript and preventing XSS attacks.

2. **Secure Flag**: In production, cookies are only sent over HTTPS.

3. **SameSite Protection**: Cookies use `SameSite=Strict` to prevent CSRF attacks.

4. **Token Rotation**: Refresh tokens are rotated on each use, limiting the window of opportunity for token theft.

5. **Short-lived Access Tokens**: Access tokens expire after 15 minutes, limiting the damage if compromised.

6. **Database Validation**: Refresh tokens are validated against the database, allowing for immediate revocation.

## Protected Routes

To protect routes, use the `auth` middleware:

```javascript
import { auth } from "./middlewares/auth.js";

router.get("/protected", auth, async (req, res) => {
  // req.userId is available here
  const userId = req.userId;
  
  // Your protected route logic
  res.json({ message: "This is protected data" });
});
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret for access tokens | Random string (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Random string (min 32 chars) |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Production Considerations

1. **Use strong, random secrets** for `JWT_SECRET` and `JWT_REFRESH_SECRET`
2. **Set `NODE_ENV=production`** to enable HTTPS-only cookies
3. **Use HTTPS** in production
4. **Set appropriate `CLIENT_URL`** for CORS
5. **Consider rate limiting** on auth endpoints
6. **Implement account lockout** after failed login attempts
7. **Add email verification** for new accounts
8. **Implement password reset** functionality

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Get Current User
```bash
curl http://localhost:4000/auth/me \
  -b cookies.txt
```

### Refresh Tokens
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:4000/auth/logout \
  -b cookies.txt
```
