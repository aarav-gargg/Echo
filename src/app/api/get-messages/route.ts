import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You must be logged in to perform this action"
        }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        const userFounded = await UserModel.aggregate([
            { $match : {id : userId} },
            { $unwind : '$messages' } ,
            { $sort : {'messages.createdAt' : -1} } , 
            { $group : {_id : '$_id' , messages : {$push : 'messages'}} }
        ])

        if(!userFounded || userFounded.length === 0){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: userFounded[0].messages
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, { status: 500 });
    }
}