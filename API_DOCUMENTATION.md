# 📘 Backend API Documentation & Frontend Guide

**Base URL:** `http://localhost:4000`  
**WebSocket URL:** `ws://localhost:4000`  
**Environment:** Node.js (Express) + Prisma + PostgreSQL

---

## �️ Configuration & headers

### 1. Credentials (Cookies)
This backend relies on **HttpOnly Cookies** (`accessToken`, `refreshToken`) for security. 
*   **Browsers**: AUTOMATICALLY handle these.
*   **Request Config**: You **must** configure your HTTP client to send credentials.

**Axios:**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true // ⚠️ CRITICAL
});
```

**Fetch API:**
```javascript
fetch(url, {
  credentials: 'include' // ⚠️ CRITICAL
});
```

### 2. TypeScript Interfaces (Data Models)
Use these types in your frontend application.

```typescript
interface User {
  id: number;
  email: string;
  isVerified: boolean;
  createdAt: string; // ISO Date
}

interface Room {
  id: string; // CUID (e.g., 'cmjs76ec...')
  user1Id: number;
  user2Id: number;
  // Included by default in /msg/room
  messages?: Message[]; 
}

interface Message {
  id: string;
  roomId: string;
  senderId: number;
  content: string;
  createdAt: string; // ISO Date
}

// WebSocket Event Wrapper
interface WSEvent<T = any> {
  type: "NEW_MESSAGE" | "ERROR" | "MESSAGE_SENT";
  data: T;
}
```

---

## 🔐 Authentication API (`/auth`)

### 1. Register User
Registers a user and immediately sends an OTP to their email.
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "strongPassword123" // Min 8 chars
  }
  ```
- **Success (200):**
  ```json
  {
    "message": "OTP sent to your email...",
    "email": "jane@example.com"
  }
  ```
- **Errors:** `400` (Validation), `409` (User exists)

### 2. Verify OTP
Verifies email and **logs the user in** (sets cookies).
- **Endpoint:** `POST /auth/verify-otp`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456",
    "verifyingFor": "signup" // Optional context
  }
  ```
- **Success (201):**
  ```json
  {
    "message": "Registration successful!",
    "user": { "id": 1, "email": "..." }
  }
  ```

### 3. Login
- **Endpoint:** `POST /auth/login`
- **Body:** `{ "email": "...", "password": "..." }`
- **Success (200):** Returns User object + Sets Cookies.

### 4. Silent Refresh
Call this when you receive a `401 Unauthorized`.
- **Endpoint:** `POST /auth/refresh`
- **Body:** Empty
- **Behavior:** Reads `refreshToken` cookie -> Validates -> Sets new `accessToken` cookie.

---

## 💬 Messaging API (`/msg`)

### 1. Get Rooms & WebSocket Token
**This is the most important endpoint for Chat.** It loads the sidebar list AND provides the security token needed for the WebSocket.

- **Endpoint:** `GET /msg/room`
- **Success (200):**
  ```json
  {
    "rooms": [
      {
        "id": "room_uid_1",
        "user1Id": 1,
        "user2Id": 3,
        "messages": [
           { "content": "Latest message here...", "createdAt": "..." }
        ]
      }
    ],
    // ⚠️ PASS THIS TOKEN TO WEBSOCKET URL
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
  }
  ```

### 2. Create Room
Starts a chat with another user. Idempotent (returns existing room if one exists).
- **Endpoint:** `POST /msg/room`
- **Body:**
  ```json
  { "otherUserId": 5 }
  ```
- **Success (200):** Returns `Room` object.

### 3. Get Full Chat History
- **Endpoint:** `GET /msg/room/:roomId/messages`
- **Success (200):** Returns `Message[]` (Ordered by createdAt ASC).

---

## ⚡ Real-Time WebSocket API

### Connection Logic
WebSockets cannot access HttpOnly cookies directly. You must append the token received from the `GET /msg/room` API.

**URL Patterns:**
1. **Chat Room:** `ws://localhost:4000/room/<ROOM_ID>?token=<ACCESS_TOKEN>`
2. **Lobby/List:** `ws://localhost:4000/rooms?token=<ACCESS_TOKEN>` (🔥🔥 NEW)

### Event Reference

#### A. Send Message (Client ➔ Server)
*Only applicable for Room connection (/room/:id)*
```json
{ "content": "Hello world" }
```

#### B. Receive Message (Server ➔ Client)
*From Room connection*
```json
{
  "type": "NEW_MESSAGE",
  "data": { ... }
}
```

#### C. Room List Update (Server ➔ Client)
*From Lobby connection (/rooms)*
Received when a message is sent in any of your rooms. Use this to update the sidebar preview text.
```json
{
  "type": "ROOM_UPDATE",
  "data": {
    "roomId": "room_uid_1",
    "lastMessage": {
      "content": "New message content...",
      "createdAt": "..."
    }
  }
}
```

#### D. Errors
```json
{ "type": "ERROR", "message": "..." }
```

---

## 🧠 Frontend Implementation Guide (React Example)

### Step 1: Request Logic
Use a standardized hook or function for calls.
```javascript
// utils/api.js
export const fetchRooms = async () => {
  const { data } = await api.get('/msg/room');
  return data; // { rooms, token }
};
```

### Step 2: Chat Component Logic
```javascript
function ChatRoom({ roomId, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [token, setToken] = useState(null); // Get this from Context or Props
  const ws = useRef(null);

  useEffect(() => {
    if (!token || !roomId) return;

    // 1. Initialize WebSocket
    ws.current = new WebSocket(`ws://localhost:4000/room/${roomId}?token=${token}`);

    // 2. Listen for Messages
    ws.current.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "NEW_MESSAGE") {
        setMessages(prev => [...prev, payload.data]);
      }
    };

    return () => ws.current.close();
  }, [roomId, token]);

  const handleSend = (text) => {
    // 3. Optimistic Update (Show immediately)
    const tempMsg = { 
      id: Date.now(), 
      content: text, 
      senderId: 'me', 
      createdAt: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMsg]);

    // 4. Send to Server
    ws.current.send(JSON.stringify({ content: text }));
  };
}
```

### Step 3: Handling 401 (Token Expiry) with WebSocket
If the WebSocket fails to connect (close code `4002` or `4001`), it likely means the token is expired.
1.  Frontend catches cleanup/error.
2.  Trigger `POST /auth/refresh`.
3.  Call `GET /msg/room` again to get a FRESH token.
4.  Reconnect WebSocket.
