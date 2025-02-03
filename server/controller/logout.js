async function logout(request, response){
    try{
        const cookieOptions = {
            http : true, //which means it can't be accessed by JavaScript on the client-side, making it more secure
            secure : true //which ensures the cookie is only sent over HTTPS connections
        }

        return response.cookie('token','',cookieOptions).status(200).json({ //the server sends a response to clear the token cookie by setting it to an empty string ('').
            message : "session out",
            success : true
        })
        } catch (error) {
            return response.status(500).json({
                message : error.message || error,
                error : true
            })
    }
}

module.exports = logout