'use client'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface CheckoutButtonProps {
  plan: string
  userEmail?: string
  className?: string
  children: ReactNode
}

export function CheckoutButton({ children, className }: CheckoutButtonProps) {
  return (
    <Button 
      className={className} 
      onClick={() => alert('Neural Checkout coming soon! This logic will integrate with Paddle.')}
    >
      {children}
    </Button>
  )
}
