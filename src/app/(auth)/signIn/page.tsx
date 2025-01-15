'use client'
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormDescription, FormLabel, FormMessage} from '@/components/ui/form'
import { FormField , FormItem  } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'


const SignIn = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })

      console.log(response);

      if (response?.error) {
        toast({
          title: "LOGIN FAILED",
          description: "Incorrect credentials",
          variant: "destructive"
        })
      }

      if (response?.url) {
        toast({
          title: "LOGIN SUCCESS",
          description: "USER LOGGED IN SUCCESSFULLY",
        })
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error("ERROR IN SIGNING UP", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data?.message
      toast({
        title: "OOPS SIGNUP FAILED",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500'>
            <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-tr text-white from-purple-600 to-pink-600 rounded-lg shadow-2xl">
                <div className='text-center'>
                    <h1 className='text-3xl font-extrabold lg:text-5xl mb-6'>
                        Join Echo Now !!
                    </h1>
                    <p className='mb-4 text-gray-200'>
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field}  className = "bg-gray-400"/>
                                    </FormControl>
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
                                        <Input placeholder="Password" {...field} className = "bg-gray-400"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <p className='text-sm text-gray-200'>
                          Not Registered Yet? <Link href={"/signUp"} className='font-bold underline'>SignUp here</Link> 
                        </p>

                        <Button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                    <Loader2 className='animate-spin'/> Logging In
                                    </>
                                ) : ('Login')
                            }
                        </Button>
                        
                    </form>
                </Form>
            </div>
        </div>
  )
}

export default SignIn
