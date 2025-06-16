import React from 'react'
import { toast } from 'sonner'

const showToast = {
  success:(message:string,description?:string)=>toast.success(message,{description}),
  error: (message: string,description?:string) => toast.error(message,{description}),
  info: (message: string,description?:string) => toast.info(message,{description}),
  warning: (message: string,description?:string) => toast.warning(message,{description}),

   promise: (promise: Promise<any>, messages: {
    loading: string,
    success: string,
    error: string
  }) => toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error
  })
}

export default showToast
