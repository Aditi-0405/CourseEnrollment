import mongoose from "mongoose";
export async function connectToDb() {
    try {

        mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log('connection established')
        })
        connection.on('error', () => {
            console.log('connection error')
            process.exit();
        })
    } catch (error) {
        console.log("An error Occured");
        console.log(error);
    }
}