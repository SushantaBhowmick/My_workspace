// app/not-found.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg space-y-6"
      >
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
         <Button className=' cursor-pointer '>
             <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
         </Button>
        </Link>
      </motion.div>
    </div>
  );
}
