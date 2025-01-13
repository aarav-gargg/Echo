'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import {LogOut , AudioLines} from 'lucide-react'

const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user;

    return (
        <nav className='p-4 md:p-6 shadow-xl'>
            <div className='container mx-auto flex flex-row md:flex-row justify-between items-center'>
                <Link className="text-xl font-bold mb-4 md:mb-0 flex flex-row gap-2 justify-center items-center" href="/">
                <AudioLines size={35}/>  Echo</Link>
                {
                    session ? (
                        <>
                            <span className="mr-4">
                                Welcome , <span className='font-extrabold text-xl font-mono text-rose-900'>{user?.username || user?.email}</span>
                            </span>
                            <Button onClick={() => { signOut() }}
                                className="w-full md:w-auto bg-slate-100 text-black" variant='destructive'
                            >
                                <LogOut/> LogOut
                            </Button>
                        </>
                    ) : (
                        <Link href="/signIn">
                            <Button className="w-full md:w-auto bg-slate-100 text-black hover:text-white" variant='default'
                            >
                                <LogOut/> LogIn
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
