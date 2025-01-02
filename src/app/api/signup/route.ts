import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/verficationEmail";

export async function POST(request : Request){
    await dbConnect();
    try {
        const {username , email , password} = await request.json() 

        const existingUsername = await UserModel.findOne({
            username , 
            isVerified : true
        });

        if(existingUsername){
            return Response.json({
                success : false , 
                message : "Username already taken"
            } , {
                status : 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false ,
                    message : "USER ALREADY EXISTS WITH THE EMAIL"
                } , {
                    status : 400
                })
            }else{
                const hashedPassword = await bcrypt.hash(password , 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password , 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username ,  
                email , 
                password : hashedPassword , 
                verifyCode , 
                verifyCodeExpiry : expiryDate , 
                isVerified : false ,
                isAcceptingMessage : true , 
                messages : []
            })

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail( email , username , verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success : false ,
                message : emailResponse.message
            } , {
                status : 500
            })
        }

        return Response.json({
            success : true ,
            message : "VERFICATION EMAIL HAS BEEN SENT PLEASE BERIFY YOUR EMAIL"
        } , {
            status : 201
        })



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
