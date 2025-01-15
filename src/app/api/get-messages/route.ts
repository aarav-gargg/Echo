import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "You must be logged in to perform this action"
        }), { status: 401 }); // Updated status to 401 (Unauthorized)
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    try {
        const userFounded = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { 
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ]);

        if (!userFounded || userFounded.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: userFounded[0].messages
        }), { status: 200 });

    } catch (error) {
        console.error("Error getting messages:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error getting messages"
        }), { status: 500 });
    }
}
