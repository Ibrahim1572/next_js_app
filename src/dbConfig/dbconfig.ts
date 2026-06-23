import mongoose from "mongoose";

export async function db_connection(){
    try {
        mongoose.connect(process.env.MONGO_URL!)

        const connection= mongoose.connection

        connection.on('connected', ()=>{
            console.log("MongoDB Connected")
        })

        connection.on('error', (err)=>{
            console.log("MongoBD Connection error: "+err)
            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong in DB connection!")
        console.log(error)
    }
}