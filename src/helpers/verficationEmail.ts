import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verfication";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'ECHO | VERFICATION EMAIL',
            react: VerificationEmail({username , otp : verifyCode}),
          });

        return{ success : true , message : "VERIFICATION EMAIL SENT SUCCESSFULLY"}
    } catch (error) {
        console.error("ERROR SENDING VERIFICATION EMAIL" , error)
        return{ success : false , message : "ERROR SENDING VERIFICATION EMAIL"} 
    }
}