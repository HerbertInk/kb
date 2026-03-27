'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
}

export function Card({ children, className, glow, hover }: CardProps) {
  return (
    <div
      className={cn(
        'border border-[--border] bg-[--surface] rounded-xl',
        glow && 'border-[--btc] btc-glow',
        hover && 'hover-lift cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
