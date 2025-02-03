const express = require ('express')
const {Server} = require ('socket.io')
const http = require ('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel,MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app = express()

/**socket connection */
const server = http.createServer(app) //creates a new HTTP server that will handle incoming requests. 
const io = new Server(server,{ //This creates a new instance of Socket.IO and attaches it to the HTTP server (server) created in the previous step. The io object allows you to handle WebSocket connections for real-time communication (like chat messages, notifications, etc.).
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})

/***socket running at http://localhost:8080/    */

//online user
const onlineUser = new Set() //This creates a Set called onlineUser. A Set is a data structure that only keeps unique values. In this case, it will store the unique user IDs of users currently connected to the server. It will help track which users are online.

io.on('connection', async(socket)=>{ //The io.on('connection') listens for incoming WebSocket connections from clients (e.g., users connecting to the server). For each connection, a new socket object is created, which is used to communicate with that specific connected client.
    console.log("connect User", socket.id) //The console.log outputs the socket ID for the user who just connected. Each time a new user connects, a unique socket.id is assigned.

    const token = socket.handshake.auth.token //everytime we refresh home page, we are generating new socket id in terminal. this is to avoid it.

    //current user detail
    const user = await getUserDetailsFromToken(token)

    //create a room
    socket.join(user?._id.toString()) //makes the current user join a room named after their user ID. This is useful for isolating communication between users, so messages can be sent directly to that user by referencing their room (i.e., their user ID).
    onlineUser.add(user?._id?.toString()) //The user's ID is added to the onlineUser Set to keep track of the online users. The Set ensures that each user ID only appears once.

    io.emit('onlineUser',Array.from(onlineUser)) //ends an event named onlineUser to all connected clients (users) with the updated list of online users (converted from a Set to an array using Array.from()).

    socket.on('message-page',async (userId)=>{ //This sets up an event listener for the message-page event. When a client (user) sends a request for messages from another user (by emitting message-page with a userId), the server handles it and responds with that user's data and previous conversation messages.
        console.log('userId',userId) //this is userId of other person you are chatting
        const userDetails = await UserModel.findById(userId).select("-password") //this one is taking userId to send all the messages to forntend related to that id

        const payload = {
            _id : userDetails?._id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            online : onlineUser.has(userId) //if user is online it will show true otherwise false
        }
        socket.emit('message-user',payload) //sending this data to message-user

        //get previous message
        const getConversationMessage = await ConversationModel.findOne({ //Finds the conversation where: The logged-in user (user?._id) is the sender, and userId is the receiver. OR the userId is the sender, and the logged-in user (user?._id) is the receiver.
           "$or" : [
                {sender : user?._id, receiver : userId }, //below code to get receiverid at sender side and senderid at receiver side. 
                {sender : userId, receiver : user?._id }
            ]
        }).populate('messages').sort({updatedAt:-1}) //when we console log, we are getting messages but only id, therefore to get message as text we add populate. adding updatedat to get all the new messages at top
        
        socket.emit('message',getConversationMessage?.messages || []) //Sends the messages to the client via a socket event ('message'). If no messages exist, it sends an empty array ([]) to avoid errors.
        })
    

     //new message
    socket.on('new message',async (data)=>{
        

        //check coversation is available for both users

       let conversation = await ConversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver }, //below code to get receiverid at sender side and senderid at receiver side
                {sender : data?.receiver, receiver : data?.sender }
            ]
        })
        console.log("conversation", conversation) //to check if the conversation is available or not
        //if conversation is not available, then it will create it
        if(!conversation){ 
                const createConversation = await ConversationModel({
                    sender : data?.sender,
                    receiver : data?.receiver
                })
                conversation = await createConversation.save()
        }
        const message = new MessageModel({
            text : data.text, //since our messagemodel require text,imageurl, and videourl
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId : data?.msgByUserId//this field because we want to identify which user is sending which msg
        })  
        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne({_id : conversation?._id},{ //look at the conversation model where each user has array of messages, here we are updating that array for partucular user
                "$push" : {messages : saveMessage?._id} //The saved message's ID is pushed into the messages array of the relevant conversation document:
        })

        const getConversationMessage = await ConversationModel.findOne({ //The updated conversation, along with populated messages, is fetched and sorted by updatedAt (newest message first)
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver }, //below code to get receiverid at sender side and senderid at receiver side. 
                {sender : data?.receiver, receiver : data?.sender }
            ]
        }).populate('messages').sort({updatedAt:-1}) //when we console log, we are getting messages but only id, therefore to get message as text we add populate. adding updatedat to get all the new messages at top
        
        io.to(data?.sender).emit('message',getConversationMessage?.messages || []) //The updated conversation messages are sent to both the sender and receiver using io.to
        io.to(data?.receiver).emit('message',getConversationMessage?.messages || [])

        //send conversation
        const conversationSender = await getConversation(data?.sender) //to show glimpse of message at sidebar below name
        const conversationReceiver = await getConversation(data?.receiver)

        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.receiver).emit('conversation',conversationReceiver)
        
    
    }) 

    //sidebar
    socket.on('sidebar',async(currentUserId)=>{ //showing messages on sidebar
        console.log("current user",currentUserId)

        const conversation = await getConversation(currentUserId)

        socket.emit('conversation',conversation)

        })


        socket.on('seen',async(msgByUserId)=>{ //once message are clicked, then unseen message number should be removed
            
            let conversation = await ConversationModel.findOne({
                "$or" : [
                    {sender : user?._id, receiver : msgByUserId }, 
                    {sender : msgByUserId, receiver : user?._id }
                ]
            })

            const conversationMessageId = conversation?.messages || []

            const updateMessages = await MessageModel.updateMany(
                {_id : {"$in" : conversationMessageId}, msgByUserId : msgByUserId}, 
                {"$set" : {seen : true}}
            )
            //send conversation
        const conversationSender = await getConversation(user?._id?.toString()) 
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id?.toString).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)
        })

        
    //disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id.toString()) //we are getting multiple no. of same ids showing on console. we want only one unique id.
        console.log('disconnect user',socket.id)
    })
})

module.exports = {app, server}