const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(request, response){
    try{ //The code first checks if there is a token in the cookies of the incoming request using request.cookies.token. If a token exists, it is assigned to the token variable. If there is no token in the cookies, it assigns an empty string "" to token
        const token = request.cookies.token || "" //with help of token(containg userid,email) we will create userdetails. if not available, then empty
        
        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message: "user details",
            data : user,
        })
    } catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = userDetails