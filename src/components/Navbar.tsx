'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { LogOut, AudioLines } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;


  return (
    <nav className="p-4 md:p-6 shadow-xl flex flex-wrap items-center justify-around">

      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Link
          href="/"
          className="text-xl font-bold flex items-center gap-2"
        >
          <AudioLines size={35} color="white" />
          <span className="font-extrabold text-transparent bg-clip-text text-white text-2xl">
            Echo
          </span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-0">
        <Button className="bg-transparent hover:bg-transparent hover:scale-105  border-purple-600 text-white font-bold transition-all">
          <Link href={session?.user ? '/dashboard' : '/signIn'}>
            Dashboard
          </Link>
        </Button>
        <Button className="bg-transparent hover:bg-transparent hover:scale-105  border-purple-600 text-white font-bold transition-all">
          <Link href="/signIn">Dashboard</Link>
        </Button>
      </div>

      
      <div>
        {(!session || !session?.user) && (
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl font-extrabold hover:scale-110 transition-all">
            <Link href="/signIn">
               Login
            </Link>
          </Button>
        )}
        {session && session?.user && (
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl font-extrabold hover:scale-110 transition-all"
            onClick={() => signOut()}
          >
            <LogOut /> LogOut
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
