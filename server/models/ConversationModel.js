const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text : {
        type : String,
        default : ""
    },
    imageUrl : {
        type : String,
        default : ""
    },
    videoUrl : {
        type : String,
        default : ""
    },
    seen : {
        type : Boolean,
        default : false
    },
    msgByUserId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User' 
    }
},{
    timestamps : true
})

const conversationSchema = new mongoose.Schema({
    sender: {
        type : mongoose.Schema.ObjectId, //userId of sender
        required : true,
        ref : 'User' //the sender field stores the ObjectId of a document from the User collection
    },
    receiver: {
        type : mongoose.Schema.ObjectId, //userId of receiver
        required : true,
        ref : 'User' //refer because it is connected to UserModel
    },
    messages: [ //array because it will contain all the messages
        {
        type : mongoose.Schema.ObjectId,
        ref : 'Message'
    }]
},{
    timestamps : true //to get when the user was updated/created
})

const MessageModel = mongoose.model('Message',messageSchema)
const ConversationModel = mongoose.model('Conversation',conversationSchema)

module.exports = {
    MessageModel,
    ConversationModel
}