const UserModel = require('../models/UserModel')

async function searchUser(request,response){
    try {
        const { search } = request.body //extracts the search value from the request.body (this is the search input provided by the user).

        const query = new RegExp(search,"i","g") //A regular expression (RegExp) is created using the search term (search) with case-insensitive ("i") and global ("g") flags. The "i" flag ensures the search is case-insensitive, and "g" allows for global matching across the entire string.

        const user = await UserModel.find({ //to find users where either the name or email field matches the regular expression. This is done using the $or operator, which means the search will look for either a match in the name or email fields.
            "$or" : [
                { name : query },
                { email : query }
            ]
        }).select("-password")

        return response.json({
            message : 'all user',
            data : user,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = searchUser