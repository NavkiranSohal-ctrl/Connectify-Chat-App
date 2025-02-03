const mongoose = require('mongoose')

async function connectDB(){ //this function to connect with mongodb database
    try {
            await mongoose.connect(process.env.MONGODB_URI)

            const connection = mongoose.connection

            connection.on('connected',() =>{
                console.log("connect to DB") //If the connection is successful, it listens for events and logs a message ("connected to DB") when the connection is established. 
            })

            connection.on ('error',(error)=>{
                console.log("Something is wrong in mongodb ",error) //If there's an error connecting to the database, it will log the error message.
            })
    } catch (error){
        console.log("something is wrong",error)  //If there's a problem during the connection attempt itself, the function catches that error and logs "something is wrong" along with the error details. 
    }
} 

module.exports = connectDB