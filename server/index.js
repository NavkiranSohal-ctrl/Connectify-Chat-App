const express = require('express');
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

//const app= express()
app.use(cors({
    origin:process.env.FRONTEND_URL, //allowing your server to communicate safely with a frontend running on a different domain or port. The credentials: true option allows cookies or authentication information to be included in the request, making it possible for users to stay logged in while using your app across different domains.
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080 //The code checks if an environment variable PORT is set (which is useful when deploying to cloud services). If it’s set, it uses that value. If it’s not set (usually in local development), it falls back to port 8080.

app.get('/',(request,response) => {
    response.json({ message: "Server running at" + PORT})
})

//api endpoints
app.use('/api',router) //used to create a route prefix for a set of routes handled by a router. The /api part means that every route defined in the router will start with /api.

connectDB().then(() =>{ //to check if server is connected to db also running correctly
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})

