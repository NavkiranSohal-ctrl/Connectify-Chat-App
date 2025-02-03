const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "provide name"] //the name field must be provided when creating a document, and if it's missing, it will return the error message "provide name"
    },
    email : {
        type : String,
        required : [true, "provide email"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "provide password"]
    },
    profile_pic : {
        type : String,
        default : ""
    }
},{
    timestamps : true //to get when the user was updated/created
})

const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel