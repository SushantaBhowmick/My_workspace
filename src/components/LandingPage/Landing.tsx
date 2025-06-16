

import React from 'react'
import Header from './LandingHeader'
import { Button } from '../ui/button'

const LandingPage = () => {
  return (
    <div>
        <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to My_workspace
        </h1>
        <p className="text-gray-600 max-w-2xl mb-6">
          This is a modern landing page built with Next.js 15, Tailwind CSS, and shadcn UI. It features a clean layout and intuitive navigation.
        </p>
        <Button className="text-white bg-blue-600 hover:bg-blue-700">
          Get Started
        </Button>
      </section>
    </main>
    </div>
  )
}

export default LandingPage
