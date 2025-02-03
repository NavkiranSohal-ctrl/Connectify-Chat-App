const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')

async function registerUser(request,response){
    try{
        const { name, email, password, profile_pic } = request.body

        const checkEmail = await UserModel.findOne({email})

        if (checkEmail){
            return response.status(400).json({
                message : "Already user exists",
                error : true,
            }) //It is checking is user is already exists if not below it is creating password in hashformat password
        } //for this we will be using bcryptjs

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword
        }

        const user = new UserModel(payload)
        const userSave = await user.save()

        return response.status(201).json({
            message : "User Created Successfully", //sending acknowledment to client 
            data : userSave, 
            success : true
        })


    } catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser