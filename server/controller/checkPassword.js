const UserModel = require("../models/UserModel")
const bcryptjs = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

async function checkPassword(request,response){
    try{
        const {password, userId} = request.body //we need Id to check which user has entered the password, This is the user ID that comes from the client’s request.

        const user =  await UserModel.findById(userId);

        const verifyPassword = await bcryptjs.compare(password, user.password)//since we hatched the password, we need to do that again to check
        
        if(!verifyPassword){
            return response.status(400).json({
                message: "Please check password",
                error : true
            })
        }

        const tokenData = {
            id : user._id, //This is the actual ID of the user stored in the MongoDB database.
            email : user.email
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn : '1d'}) //we will send token with cookie
        console.log(process.env.JWT_SECRET_KEY)
        const cookieOptions = {
            httponly : true,
            secure : true
        }

        return response.cookie('token',token,cookieOptions).status(200).json({ //to store the token in the user's browser as a cookie, which will be included in subsequent requests. 
            message : "Login sccessfully",
            token : token, //here we don't want to return data to user when logged in, we want to send a token
            success : true
        })

    } catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword