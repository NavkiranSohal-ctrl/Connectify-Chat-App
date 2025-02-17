# WhatsApp Clone (Connectify Chat-App)
A real-time messaging **Chat App** built using **React, Socket.io, Node.js, Redux-Toolkit, and MongoDB**.

 **Live Demo:** https://connectify-chat-app-neon.vercel.app/

### Features
    User Authentication: Secure login and registration using JWT.
    Real-time Chat: Instant messaging using Socket.io.
    Group & Private Chats: Users can create or join conversations.
    Message Storage: Messages are stored in MongoDB for persistence.
    Typing Indicators: See when other users are typing.
    Online/Offline Status: Track user availability in real time.
    Responsive Design: Styled using Tailwind CSS for a modern, responsive UI.

## Tech Stack

### Frontend
    React.js (with Vite)
    Redux Toolkit for state management
    Tailwind CSS for styling
    Axios for HTTP requests
    Date-fns for date handling
    React Router DOM for routing
    Socket.io Client for real-time communication
### Backend
    Express.js for API
    MongoDB with Mongoose for database
    JWT for authentication
    Multer for file uploads
    Bcrypt.js for password encryption
    AWS for secure storage
    Cookie-parser for cookie management
    Image-downloader for downloading images from URLs
    Cors for enabling cross-origin requests

### Prerequisites
Ensure you have the following installed:
    Node.js,
    Yarn,
    MongoDB (Atlas or local setup)

### Key Scripts
Command	Description
    Frontend: `"yarn dev"` - Starts the React development server.
    Backend: `"nodemon index.js"` - Starts the Express server.

## Packages and Their Use Cases

  ###  Frontend:
    react-router-dom: For handling routes.
    axios: For making HTTP requests.
    redux-toolkit: For managing global state.
    socket.io-client: For real-time communication.

   ### Backend:
    express: For setting up the API.
    mongoose: For interacting with MongoDB.
    dotenv: For managing environment variables.
    bcryptjs: For hashing passwords.
    jsonwebtoken: For creating authentication tokens.
    cors: For enabling cross-origin requests.
    cookie-parser: For managing cookies.
    socket.io: For WebSocket-based real-time communication.

Contributions are welcome! Feel free to open issues or submit pull requests.😊
