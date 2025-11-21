// seat-reserve-pro-backend/src/config/db.ts

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // Handle the error object type for TypeScript
        let message = "Unknown Error";
        if (err instanceof Error) {
            message = err.message;
        }

        console.error(`Error: ${message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;