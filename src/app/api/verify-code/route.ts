import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { codeValidation } from "@/schemas/verifySchema";

const verifyUserSchema = z.object({
  username: z.string(),
  code: codeValidation,
});

export async function POST(request: Request) {
  await dbConnect();

  try {

    const body = await request.json();
    const result = verifyUserSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.format();
      const usernameErrors = errors.username?._errors || [];
      const codeErrors = errors.code?._errors || [];

      return Response.json(
        {
          success: false,
          message: [...usernameErrors, ...codeErrors].join(", ") || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { username, code } = result.data;


    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, error: "USER NOT FOUND" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const notExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && notExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "ACCOUNT VERIFICATION DONE SUCCESSFULLY" },
        { status: 200 }
      );
    } else if (!notExpired) {
      return Response.json(
        { success: false, error: "VERIFICATION CODE EXPIRED, SIGNUP AGAIN" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, error: "INCORRECT CODE" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("ERROR CHECKING RESPONSE", error);
    return Response.json(
      { success: false, error: "Error verifying user" },
      { status: 500 }
    );
  }
}
