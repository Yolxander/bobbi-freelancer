'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useToast as useToastUI } from '@/components/ui/use-toast'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast } = useToastUI()

  const showToast = (type: ToastType, message: string) => {
    const variant = type === 'error' ? 'destructive' : type === 'success' ? 'default' : type
    toast({
      variant,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 