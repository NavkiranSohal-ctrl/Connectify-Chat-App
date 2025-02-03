# Connectify Chat App (WhatsApp Clone)
A real-time messaging chat application built using the MERN stack (MongoDB, Express.js, React, and Node.js) with Socket.io for real-time communication and Redux Toolkit for state management. This project enables seamless user authentication, live messaging, and media sharing.

### Features
    User Authentication: Secure login and registration using JWT.
    Real-Time Messaging: Instant chat functionality powered by Socket.io.
    Message Status: Tracks message delivery, seen status, and timestamps.
    Media Sharing: Supports image and video uploads within conversations.
    Redux State Management: Efficient global state handling using Redux Toolkit.
    Responsive Design: Styled with Tailwind CSS for a modern and adaptive UI.

## Tech Stack

### Frontend
    React.js (with Vite)
    Tailwind CSS for styling
    Axios for HTTP requests
    React Router DOM for routing

### Backend
    Express.js – Backend framework for handling API routes.
    MongoDB & Mongoose – NoSQL database for storing messages and user data.
    JWT (JSON Web Token) – Secure authentication and user session management.
    Bcrypt.js – Password hashing for user security.
    Cookie-parser – Managing authentication cookies.
    CORS – Enables cross-origin requests for frontend-backend communication.
    Socket.io – Handles real-time messaging between users (important for a chat app).

### Prerequisites
Ensure you have the following installed:
    Node.js,
    Yarn,
    MongoDB (Atlas or local setup)

### Key Scripts
Command	Description
"npm start" (frontend)	Starts the React development server.
"npm run dev" (backend)	Starts the Express server.

## Packages and Their Use Cases

  ###  Frontend:
        react-router-dom: For handling routes.
        axios: For making HTTP requests.
        redux: For managing the global state of the application.

   ### Backend:
        express: For setting up the API.
        mongoose: For interacting with MongoDB.
        dotenv: For managing environment variables.
        bcryptjs: For hashing passwords.
        jsonwebtoken: For creating authentication tokens.
        cors: For enabling cross-origin requests.
        cookie-parser: For managing cookies.
        socket.io: For enabling real-time communication between the server and clients.

## Deployment
    The app can be deployed on platforms like Vercel

Contributions are welcome! Feel free to open issues or submit pull requests.😊
