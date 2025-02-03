const { ConversationModel } = require("../models/ConversationModel")

const getConversation = async(currentUserId)=>{ //represents the unique identifier (ID) of the currently logged-in or active user who is making the request to fetch their conversations.
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({ //to find all conversation documents in the database.
            "$or" : [
                { sender : currentUserId }, //The condition "$or" : [{ sender : currentUserId }, { receiver : currentUserId }] uses the $or operator, meaning it will find conversations where the current user is either the sender or the receiver of the conversation.
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('messages').populate('sender').populate('receiver') //The .sort({ updatedAt: -1 }) part sorts the conversations in descending order based on the updatedAt field. This ensures that the most recently updated conversations appear first.
        //This will populate the messages field with the actual message details (rather than just storing the message references in the conversation). This will populate the sender/receiver field with the full user details of the sender/receiver (rather than just their user ID).
        //The result of this query will be an array of conversation objects where the current user is either the sender or receiver, sorted by the most recent update, and with the messages, sender, and receiver fields fully populated with detailed information.
        
        const conversation = currentUserConversation.map((conv)=>{ //For each conversation (conv), it performs the following steps:
            const countUnseenMsg = conv?.messages?.reduce((preve,curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if(msgByUserId !== currentUserId){ //It checks if the message is sent by someone other than the current user (msgByUserId !== currentUserId). If it's not sent by the current user, it checks if the message is marked as seen or not.
                    return  preve + (curr?.seen ? 0 : 1) //If the message is not seen (!curr?.seen), it increments a counter (preve + 1), which keeps track of how many unseen messages there are for the current user.
                }else{ //The result of reduce() is the total number of unseen messages for the current user in this conversation.
                    return preve
                }
             
            },0)
            
            return{
                _id : conv?._id, //The unique ID of the conversation (conv?._id).
                sender : conv?.sender, //The sender details of the conversation (conv?.sender).
                receiver : conv?.receiver, //The receiver details of the conversation (conv?.receiver).
                unseenMsg : countUnseenMsg, //The count of unseen messages that were calculated earlier.
                lastMsg : conv.messages[conv?.messages?.length - 1] //The last message in the conversation (conv.messages[conv?.messages?.length - 1]), which is accessed by getting the last element of the messages array.
            }
        })

        return conversation
    }else{
        return []
    }
}

module.exports = getConversation