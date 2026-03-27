'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, rightElement, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[--muted-light] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'kb-input',
              error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]',
              !!rightElement && 'pr-16',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-[--error]">{error}</p>}
        {helpText && !error && (
          <p className="mt-1.5 text-xs text-[--muted]">{helpText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
