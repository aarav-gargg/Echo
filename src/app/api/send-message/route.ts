import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User.model";

export async function POST(request : Request){
    await dbConnect();

    const {content , username} = await request.json();

    try {
        const user = await UserModel.findOne({username}) 
        if(!user){
            return Response.json({
                success : false , 
                messages : "USER NOT FOUND"
            } , {
                status : 404
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success : false , 
                messages : "USER IS CURRENTLY NOT ACCEPTING MESSAGES"
            } , {
                status : 403
            })
        }

        const newMessage = {content , createdAt : new Date()};

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success : true , 
            messages : "MESSAGE SENT SUCCESSFULLY"
        } , {
            status : 200
        })
    } catch (error) {
        return Response.json({
            success : false , 
            messages : "ERROR SENDING MESSAGE"
        } , {
            status : 500
        })
    }
}