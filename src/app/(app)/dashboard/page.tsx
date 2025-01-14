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
import { Separator } from "@/components/ui/separator";
import { LogOut, Copy, Loader, RefreshCcw } from 'lucide-react'
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";

const Dahsboard = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const { username } = session?.user || "";
  const profileUrl = `${baseUrl}/u/${username}`

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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url Copied",
      description: "Profile url has been copied to the clipboard"
    })
  }

  if (!session || !session.user) {
    return (
      <>
        <div className="flex flex-col  p-10 items-center justify-center m-10">
          <div className="text-2xl text-red-700 font-bold m-10 p-10">Not Logged in</div>
          <Link href="/signIn">
            <Button className="w-full md:w-auto bg-slate-100 text-black hover:text-white" variant='default'>
              <LogOut /> LogIn
            </Button>
          </Link>
        </div>
      </>
    )

  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">
          User Dashboard
        </h1>
        <div className="my-6 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="font-extrabold text-2xl mb-3">
            Unleash the mystery! Share your link, spark curiosity, and let the secrets roll in.
          </h1>
          <div className="my-2">
            <h2 className="text-lg font-semibold mb-2">Copy Your Link from here</h2>
            <div className="flex flex-row">
              <input type="text"
                disabled
                value={profileUrl}
                className="input input-bordered w-full p-2 mr-2 bg-gray-100 text-black font-semibold rounded-xl"
              />
              <Button variant="outline" onClick={handleCopyUrl}>
                <Copy /> Copy
              </Button>
            </div>
            <div className="my-3 flex flex-row items-center gap-2">
              <Switch
                {...register('acceptingMessages')}
                checked={acceptingMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
              <span className="font-semibold text-lg font-serif">
                Accept Messages : <span className={`${acceptingMessages ? "text-green-600" : "text-red-600"} font-bold`}>{acceptingMessages ? "On" : "Off"}</span>
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="my-5">
          <div className="mt-4 flex flex-row justify-between">
            <div>
              <h1 className="text-4xl font-extrabold">Recieved Messages</h1>
            </div>
            <div>
              <Button onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}>
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" />
                    Refreshing
                  </>
                ) : (
                  <>
                    <RefreshCcw />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="my-6 flex items-center justify-center">
            {messages.length > 0 ? (
              messages.map((item, index) => (
                <MessageCard
                  key={index}
                  message={item}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="font-bold text-3xl text-red-700">
                No Messages to Display.
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export default Dahsboard
