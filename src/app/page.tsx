'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowDown } from "lucide-react"
import { Separator } from "@/components/ui/separator";

export default function Home() {

  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is Echo",
      answer: "This is an anonymous messaging platform where users can send messages without revealing their identity."
    },
    {
      question: "Is my message anonymous?",
      answer: "Yes, all messages are sent anonymously to maintain privacy."
    },
    {
      question: "Where do I get the profile url to send the message?",
      answer: "The profile URL can only be shared by the user themselves."
    },
    {
      question: "Where can I get my profile url?",
      answer: "Sign in to your website, and you can copy your URL from your dashboard and share it with people to start receiving messages."
    },
    {
      question: "Do I have to sign in to send messages?",
      answer: "No, users can send messages without needing to sign in, but they can get their own profile URL only by signing in."
    }
  ];

  return (
    <div className="flex flex-col p-10 min-h-screen">
      <main className="justify-center mx-auto w-full max-w-5xl p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-4xl sm:text-4xl font-semibold text-white text-center mb-10 flex"
        >
          <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
            <div className="text-center sm:text-left sm:max-w-xl">
              <h1 className="mb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                Send Messages. Stay Anonymous. Connect Beyond Boundaries.
              </h1>
              <p className="text-lg text-gray-300">
                Experience seamless and anonymous communication with a secure platform built for everyone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='default' className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl font-extrabold hover:scale-110 transition-all ease-in-out">
                    Send Message
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-to-tr from-purple-600 to-pink-600">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send a Message</AlertDialogTitle>
                    <AlertDialogDescription className="text-white">
                      Enter the URL and your message below to send it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="mb-4">
                    <label htmlFor="url" className="block text-sm font-medium text-white">
                      URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={url}
                      placeholder="Enter the URL"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-white">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      value={message}
                      placeholder="Enter your message"
                    />
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Send</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex justify-center sm:justify-end w-full h-full">
              <img
                src="./img.jpg"
                alt="Message"
                className="rounded-lg shadow-xl w-full h-full max-w-lg sm:max-w-xl"
              />
            </div>
          </div>
        </motion.div>

        <Separator />
      </main>

      <motion.div>
        <div className="my-5 p-5">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
            Frequently Asked Questions
          </motion.h1>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <motion.div key={index}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}
                className="shadow-2xl font-semibold p-4 space-y-4 rounded-lg"
              >
                <div className="flex flex-row justify-between">
                  <span className="font-extrabold text-lg">
                    {item.question}
                  </span>
                  <Button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="bg-transparent hover:bg-transparent hover:scale-105 hover:border-2 border-gray-300 px-6 py-3 text-lg transition-transform duration-200">
                    <ArrowDown />
                  </Button>
                </div>

                {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-gray-300"
                    >
                      {item.answer}
                    </motion.div>
                  )}

              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <Separator />
    </div>
  );
}
