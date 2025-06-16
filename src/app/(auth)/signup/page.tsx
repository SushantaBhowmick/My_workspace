import AuthForm from '@/components/AuthForm'
import React from 'react'

const page = () => {
  return (
     <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-4 font-bold">Sign Up</h1>
        <AuthForm type="signup" />
      </div>
    </main>
  )
}

export default page
