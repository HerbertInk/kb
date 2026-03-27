'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Zap, Menu, X, Home, PenTool, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  rightContent?: React.ReactNode
  backLink?: { href: string; label: string }
  breadcrumb?: string
}

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/quiz/join', label: 'Join Quiz', icon: Play },
  { href: '/setter', label: 'Setter Portal', icon: PenTool },
]

export function Header({ rightContent, backLink, breadcrumb }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[--bg]/80 backdrop-blur-xl border-b border-[--border]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(247,147,26,0.4)] transition-shadow">
                <Zap size={16} className="text-white" fill="currentColor" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight hidden sm:block">
                KB<span className="text-[--btc]">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href ||
                  (link.href === '/setter' && pathname.startsWith('/setter')) ||
                  (link.href === '/quiz/join' && pathname.startsWith('/quiz'))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-[--surface-2] text-[--text-bright]'
                        : 'text-[--muted] hover:text-[--text] hover:bg-[--surface]'
                    )}
                  >
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Breadcrumb */}
            {backLink && (
              <div className="flex items-center gap-2 text-sm md:hidden">
                <Link href={backLink.href} className="text-[--muted] hover:text-[--btc] transition-colors">
                  ← {backLink.label}
                </Link>
                {breadcrumb && (
                  <>
                    <span className="text-[--border]">/</span>
                    <span className="text-[--muted-light] text-xs">{breadcrumb}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {rightContent}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[--muted] hover:text-[--text] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[--border] bg-[--surface] px-4 py-3 space-y-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-[--surface-2] text-[--btc]'
                    : 'text-[--muted] hover:text-[--text] hover:bg-[--surface-2]'
                )}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
