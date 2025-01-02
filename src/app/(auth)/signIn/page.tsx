'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button
                className="bg-gradient-to-tr bg-blue-800 hover:bg-gradient-to-tr hover:bg-blue-600 transition-all duration-300 ease-in-out p-2 rounded-lg"
                onClick={() => signIn()}
            >
                Sign in
            </button>

        </>
    )
}