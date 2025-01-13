'use client'

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User.model";
import { acceptingMessagesSchema } from "@/schemas/acceptingMessages";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

const Dahsboard = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptingMessagesSchema)
  })
  const { register, watch, setValue } = form;
  const acceptingMessages = watch('acceptingMessages')

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptingMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get("/api/get-messages");

      setMessages(response.data.message || []);

      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest Messages"
        })
      }

    } catch (error) {

    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false)
    }
  }, [setMessages, setIsLoading])

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchMessages();
    fetchAcceptMessages();

  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptingMessages
      })

      setValue('acceptingMessages', !acceptingMessages);

      toast({
        title: response.data.message,
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    }
  }

  if (!session || !session.user) {
    return (
      <>
        <div className="flex flex-col  p-10 items-center justify-center m-10">
          <div className="text-2xl text-red-700 font-bold m-10 p-10">Not Logged in</div>
          <Link href="/signIn">
              <Button className="w-full md:w-auto bg-slate-100 text-black hover:text-white" variant='default'>
                <LogOut/> LogIn
              </Button>
          </Link>
        </div>
      </>
    )

  }

  return (
    <div>
      DASHBOARD
    </div>
  )
}

export default Dahsboard
