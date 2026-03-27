import type { Metadata } from 'next'
import { Inter, Space_Mono, Syne } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'KB — Knowledge Byte',
  description: 'Quiz competitions powered by Bitcoin Lightning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${syne.variable} h-full`}>
      <body className="bg-[--bg] text-[--text] antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
