const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(request,response){
    try{
        const token = request.cookies.token || "" //with help of token(containg userid,email) we will create userdetails. if not available, then empty
        
        const user = await getUserDetailsFromToken(token)

        const { name , profile_pic} = request.body

        const updateUser = await UserModel.updateOne({ _id : user._id }, { //first we have to give id, then the field which we want to update
            name, //_id is mongodbId whereas user._id is extracted from token
            profile_pic
        }) 

        const userInformation = await UserModel.findById(user._id)

        return response.json({
            message : "User update successfully",
            data : userInformation,
            success : true
        })
    } 
    catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails