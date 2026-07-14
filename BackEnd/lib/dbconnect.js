import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"))
        mongoose.connection.on('error', (err) => console.log("MongoDB error:", err.message))
        mongoose.connection.on('disconnected', () => console.log("MongoDB disconnected"))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        })
    } catch (error) {
        console.log("DB Connection failed:", error.message)
        process.exit(1)
    }
}

export default connectDB