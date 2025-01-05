'use client'
import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/router'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormLabel, FormMessage} from '@/components/ui/form'
import { FormField , FormItem  } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'


const page = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)
    const { toast } = useToast();
    

    const debouncedUsername = useDebounceValue(username, 300);

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    useEffect(() => {

        const usernameCheck = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/unique-username?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data?.message ?? "ERROR CHECKING USERNAME");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }

        usernameCheck();

    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setisSubmitting(true);
        try {
            const response = await axios.post(`/api/signup`, { data })
            if (response.data.success == true) {
                toast({
                    title: "SUCCESS",
                    description: response.data.message,
                })
                // router.replace(`/verify/${username}`);
            }
            setisSubmitting(false);
        } catch (error) {
            console.error("ERROR IN SIGNING UP", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data?.message
            toast({
                title: "OOPS SIGNUP FAILED",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }


    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <div className='text-center'>
                    <h1 className='text-3xl font-extrabold lg:text-5xl mb-6'>
                        Join Echo Now !!
                    </h1>
                    <p className='mb-4'>
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            setUsername(e.target.value)
                                        }}/>
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field}/>
                                    </FormControl>
                                    <FormDescription>This is your email.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field}/>
                                    </FormControl>
                                    <FormDescription>This is your password.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                    <Loader2 /> Please wait
                                    </>
                                ) : ('SignUp')
                            }
                        </Button>
                        
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page
