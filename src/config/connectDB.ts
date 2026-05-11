import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "MONGODB_URI is not defined. Add it to your .env file."
        );
    }

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to MongoDB Atlas");
    });
    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose disconnected");
    });

    await mongoose.connect(uri);
}


export async function disconnectDB(): Promise<void> {
    await mongoose.disconnect();
    console.error("Mongoose disconnected cleanly");
}