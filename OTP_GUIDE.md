# OTP Email Verification Guide

This guide explains how to set up and use the OTP (One-Time Password) email verification system for user registration.

## 📧 Email Setup

### Option 1: Gmail (Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update your `.env` file**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Option 2: Other Email Services

For services like Outlook, Yahoo, etc.:

```env
EMAIL_SERVICE=outlook  # or yahoo, etc.
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### Option 3: Custom SMTP (Production)

For production, use a dedicated email service like SendGrid, Mailgun, or AWS SES:

```env
NODE_ENV=production
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## 🔄 Registration Flow

### Step 1: Register (Send OTP)

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent to your email. Please verify to complete registration.",
  "email": "user@example.com"
}
```

**What happens:**
1. Validates email format and password strength (min 8 characters)
2. Checks if user already exists and is verified
3. Generates a 6-digit OTP
4. Hashes the password
5. Creates/updates user with OTP (expires in 10 minutes)
6. Sends OTP email
7. Returns success message

### Step 2: Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Registration successful! Welcome aboard!",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**What happens:**
1. Validates OTP against database
2. Checks if OTP is expired (10-minute window)
3. Marks user as verified
4. Clears OTP from database
5. Sends welcome email
6. Generates access and refresh tokens
7. Sets HTTP-only cookies
8. Returns success with user data

### Step 3: Resend OTP (Optional)

**Endpoint:** `POST /auth/resend-otp`

**Request:**
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

## 🧪 Testing the OTP Flow

### Using cURL

```bash
# Step 1: Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Check your email for OTP

# Step 2: Verify OTP
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}' \
  -c cookies.txt

# Step 3 (Optional): Resend OTP if expired
curl -X POST http://localhost:4000/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Using JavaScript/Fetch

```javascript
// Step 1: Register
const registerResponse = await fetch('http://localhost:4000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});

const registerData = await registerResponse.json();
console.log(registerData.message);

// Step 2: User enters OTP from email, then verify
const verifyResponse = await fetch('http://localhost:4000/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456' // OTP from email
  })
});

const verifyData = await verifyResponse.json();
console.log(verifyData.message);
```

## 📱 Client-Side Implementation Example

### React Registration Form

```jsx
import { useState } from 'react';

function RegistrationFlow() {
  const [step, setStep] = useState(1); // 1: register, 2: verify
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setStep(2); // Move to OTP verification step
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Registration successful!');
        // Redirect to dashboard or home
        window.location.href = '/dashboard';
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch('http://localhost:4000/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to resend OTP.');
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      
      {step === 1 && (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button type="submit">Register</button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <h2>Verify Email</h2>
          <p>Enter the 6-digit code sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <button type="submit">Verify</button>
          <button type="button" onClick={handleResendOTP}>
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
}
```

## 🔒 Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Password Hashing**: Passwords are hashed with bcrypt before storage
3. **Email Validation**: Email format is validated
4. **Password Strength**: Minimum 8 characters required
5. **Verification Required**: Users must verify email before login
6. **OTP Regeneration**: Old OTPs are replaced when resending
7. **HTTP-Only Cookies**: Tokens stored securely after verification

## ⚠️ Error Handling

### Common Error Responses

**Invalid Email Format:**
```json
{
  "message": "Invalid email format"
}
```

**Weak Password:**
```json
{
  "message": "Password must be at least 8 characters long"
}
```

**User Already Exists:**
```json
{
  "message": "User already exists"
}
```

**Invalid OTP:**
```json
{
  "message": "Invalid OTP"
}
```

**Expired OTP:**
```json
{
  "message": "OTP has expired. Please request a new one."
}
```

**Email Not Verified (on login):**
```json
{
  "message": "Please verify your email before logging in",
  "code": "EMAIL_NOT_VERIFIED"
}
```

## 📊 Database Schema

The User model includes these OTP-related fields:

```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  password     String
  refreshToken String?
  otp          String?      // 6-digit OTP code
  otpExpiry    DateTime?    // OTP expiration time
  isVerified   Boolean   @default(false)  // Email verification status
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

## 🚀 Production Checklist

- [ ] Set up production SMTP service (SendGrid, Mailgun, AWS SES)
- [ ] Update `NODE_ENV=production` in `.env`
- [ ] Configure proper `EMAIL_FROM` domain
- [ ] Set up email templates with your branding
- [ ] Implement rate limiting on OTP endpoints
- [ ] Add logging for OTP generation and verification
- [ ] Consider adding SMS OTP as backup
- [ ] Monitor email delivery rates
- [ ] Set up email bounce handling
- [ ] Add CAPTCHA to prevent abuse

## 🎨 Customizing Email Templates

Edit `src/lib/email.js` to customize the email HTML:

```javascript
// Customize OTP email
export const sendOTPEmail = async (email, otp) => {
  // Modify the HTML template here
  const mailOptions = {
    // ... your custom template
  };
};

// Customize welcome email
export const sendWelcomeEmail = async (email, userName) => {
  // ... your custom template
};
```

## 📝 Notes

- OTPs are 6 digits for better user experience
- OTP expiry is set to 10 minutes (configurable)
- Unverified users can re-register to get a new OTP
- Welcome email is sent asynchronously (non-blocking)
- Failed welcome emails don't block registration completion
