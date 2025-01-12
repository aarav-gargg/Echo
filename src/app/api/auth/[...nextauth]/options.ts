import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    console.log("data received" , credentials)
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("NO USER FOUND WITH THIS EMAIL")
                    }

                    if (!user.isVerified) {
                        throw new Error("EMAIL NOT VERIFIED , PLEASE VERIFY YOUR EMAIL FIRST")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password")
                    }


                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],

    callbacks: {
        async session({ session, token }) {

            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        }
    },

    pages: {
        signIn: "/signIn"
    },

    session: {
        strategy: "jwt"
    },

    secret: process.env.NEXT_AUTH_SECRETKEY
}