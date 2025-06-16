// components/global/GlobalSpinner.tsx
'use client'

import { useGlobalLoader } from '@/store/useGlobalLoader'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

export default function Loader() {
  const { isLoading } = useGlobalLoader()

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300',
        isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <Loader2 className="h-12 w-12 animate-spin text-white" />
    </div>
  )
}
