import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected: number;
};

const connection: ConnectionObject = { isConnected: 0 };

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("ALREADY CONNECTED TO THE DATABASE");
        return;
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("Environment variable MONGO_URI is not defined");
    }

    try {
        const db = await mongoose.connect(uri);
        connection.isConnected = db.connections[0].readyState;

        console.log("DB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("DATABASE CONNECTION FAILED", error);
        throw new Error("Unable to connect to the database");
    }
}

export default dbConnect;
