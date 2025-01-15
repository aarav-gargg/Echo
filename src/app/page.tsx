'use client'
import {motion} from "framer-motion"

export default function Home() {
  return (
    <div className = "item-center flex justify-center p-10">
      <main>
        <motion.div
        initial = {{opacity : 0}}
        animate = {{opacity : 1}}
        transition={{duration : 0.5 , ease : 'easeInOut'}}
        className = "text-4xl font-sans text-gray-600"
        >
          Welcome to Echo
        </motion.div>
      </main>
    </div>
  );
}
