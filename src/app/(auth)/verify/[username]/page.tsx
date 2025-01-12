"use client"
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { verifySchema } from '@/schemas/verifySchema';
import * as z from "zod"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from '@/components/ui/form'
import { FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const verifyAccount = () => {

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      })

      toast({
        title: "SUCCESS",
        description: response.data.message,
      })

      router.replace('/signIn')

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
      setIsVerifying(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl'>
        <div className='text-center'>
          <h1 className='text-3xl font-extrabold lg:text-5xl mb-6'>
            Verify your Account
          </h1>
          <p className='mb-4'>
            Enter the verification code sent to your email.
          </p>
        </div>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isVerifying} >
              {isVerifying ? (
                <>
                  <Loader2 className='animate-spin' /> Verifying
                </>
              ) : ('Verify')}
            </Button>

          </form>
        </Form>

      </div>
    </div>
  )
}

export default verifyAccount
