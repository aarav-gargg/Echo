import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/verficationEmail";

export async function POST(request : Request){
    await dbConnect();
    try {
        const {username , email , password} = await request.json() 
    } catch (error) {
        console.error("ERROR REGISTERING USER")
        return Response.json(
            {
                success : false , 
                message : "ERROR REGISTERING THE USER"
            } , 
            {
                status : 500
            }
        )
    }
}
