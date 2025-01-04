import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You must be logged in to perform this action"
        }, { status: 404 });
    }

    const userId = user?._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        }, { new: true })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "USER NOT UPDATED"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "ACCEPTING MESSAGES STATUS UPDATED SUCCESSFULLY"
        }, { status: 200 });


    } catch (error) {
        return Response.json({
            success: false,
            message: "UPDATION FAILED"
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You must be logged in to perform this action"
        }, { status: 404 });
    }

    const userId = user?._id;

    try {
        const userFounded = await UserModel.findById(userId);

        if (!userFounded) {
            return Response.json({
                success: false,
                message: "USER NOT FOUND"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessages
        }, { status: 200 });
    } catch (error) {
        return Response.json({
            success: false,
            message: "ERROR IN GETTING USER STATUS"
        }, { status: 500 });
    }
}

