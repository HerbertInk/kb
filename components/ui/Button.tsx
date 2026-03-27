'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97]'

    const variantClasses = {
      primary: 'bg-gradient-to-r from-[--btc] to-[--btc-dim] text-white hover:shadow-[0_4px_20px_rgba(247,147,26,0.35)] hover:brightness-110',
      secondary: 'bg-[--surface-2] border border-[--border] text-[--text] hover:border-[--btc] hover:text-[--btc]',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
      ghost: 'text-[--muted] hover:text-[--text] hover:bg-[--surface]',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-[0_4px_20px_rgba(52,211,153,0.3)]',
    }

    const sizeClasses = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-sm',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
