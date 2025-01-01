import mongoose from 'mongoose'
import { env } from 'process';

type connectionObject = {
    isConnected?:number
}

const connection : connectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("ALREADY CONNECTED TO THE DATABASE");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '')

        connection.isConnected = db.connections[0].readyState;

        console.log("DB CONNECTED SUCCESFULLY");

    } catch (error) {
        console.log("DATABSE CONNECTIONS FAILED" , error);
        process.exit(1);
    }
}

export default dbConnect;

