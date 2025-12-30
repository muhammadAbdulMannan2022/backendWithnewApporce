# Backend API & WebSocket Server

A complete backend solution featuring secure authentication (cookies, refresh tokens, OTP) and real-time messaging using WebSockets.

## Features

- ✅ **Real-time Chat** - WebSocket-based messaging with immediate delivery
- ✅ **Email Verification with OTP** - 6-digit OTP sent to email for registration verification
- ✅ **Secure Authentication** - HTTP-Only cookies, Access & Refresh tokens
- ✅ **Token Rotation** - Automatic token rotation for enhanced security
- ✅ **Message History** - Persistent chat history stored in PostgreSQL
- ✅ **Room Management** - Create and list chat rooms
- ✅ **Online Status** - Real-time user visibility (via WebSocket)

## Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and Update `JWT_SECRET` and `JWT_REFRESH_SECRET`.

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

---

## 📡 WebSocket API

The WebSocket server runs on the same port as the HTTP server (default: `4000`).

### Connection URL
```
ws://localhost:4000/<route>?token=<access_token>
```

### Authentication Methods
The WebSocket server checks for the access token in this order:
1. **Cookies:** `accessToken` cookie (automatic for browsers)
2. **Query Param:** `?token=eyJ...` (for Postman/Apps)
3. **Header:** `Authorization: Bearer <token>`

### WebSocket Routes

| Route | Description |
|-------|-------------|
| `/users` | Connect to get a list of users. |
| `/room/<roomId>` | Connect to a specific chat room to send/receive messages. |

### Message Events

**Sending a Message (Client -> Server):**
```json
{
  "content": "Hello world"
}
```

**Receiving a Message (Server -> Client):**
*Event: `NEW_MESSAGE`* (Broadcasted to other users in the room)
```json
{
  "type": "NEW_MESSAGE",
  "data": {
    "id": "cmj...",
    "content": "Hello world",
    "senderId": 1,
    "createdAt": "2024..."
  }
}
```

**Note:** The sender does **not** receive the `NEW_MESSAGE` event back (to prevent duplicates). The message is just saved and sent to others.

---

## 💬 Messaging HTTP API

### 1. Get All Rooms
Retrieves all rooms the user is part of. **Crucially, this also returns the Access Token**, which you can use to connect to the WebSocket.

- **GET** `/msg/room`
- **Response:**
  ```json
  {
    "rooms": [
      {
        "id": "room_id_1",
        "user1Id": 1,
        "user2Id": 2,
        "messages": [{ "content": "latest msg..." }]
      }
    ],
    "token": "eyJhbG..." // <--- Use this for WebSocket connection
  }
  ```

### 2. Create Room
Creates a new chat room with another user.

- **POST** `/msg/room`
- **Body:** `{ "otherUserId": 2 }`
- **Response:** Room object + `token`

### 3. Get Message History
- **GET** `/msg/room/:roomId/messages`

---

## 🔐 Authentication API

### POST `/auth/register`
Register a new user and trigger OTP email.
- **Body:** `{ "email": "...", "password": "..." }`

### POST `/auth/verify-otp`
Verify email and log in.
- **Body:** `{ "email": "...", "otp": "..." }`
- **Sets Cookies:** `accessToken`, `refreshToken`

### POST `/auth/login`
- **Body:** `{ "email": "...", "password": "..." }`

### POST `/auth/refresh`
Silent refresh to get new tokens. (Handled automatically via cookies).

### POST `/auth/logout`
Clears cookies.

---

## 🛠 Project Structure

- `src/server.js` - HTTP server entry point
- `src/websocket.js` - WebSocket server entry point & routing
- `src/app.js` - Express app setup
- `src/routes/auth.js` - Authentication endpoints
- `src/routes/message.js` - Messaging HTTP endpoints
- `src/routes/messagews.js` - **WebSocket Room Logic** (Handle messages, DB save, Broadcast)
- `src/lib/prisma.js` - DB Client

## Client-Side Example (React)

```javascript
// 1. Fetch Rooms & Token
const res = await fetch('/msg/room');
const { rooms, token } = await res.json();

// 2. Connect to WebSocket
const ws = new WebSocket(`ws://localhost:4000/room/${rooms[0].id}?token=${token}`);

ws.onopen = () => {
  console.log('Connected!');
  // 3. Send Message
  ws.send(JSON.stringify({ content: "Hello!" }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'NEW_MESSAGE') {
    console.log('New message from others:', msg.data.content);
  }
};
```
