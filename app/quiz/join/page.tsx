'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/common'
import { Button, Input, Card } from '@/components/ui'

export default function JoinPage() {
  const router = useRouter()
  const [form, setForm] = useState({ accessCode: '', name: '', lightningAddress: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function join(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      sessionStorage.setItem('participant', JSON.stringify(data.participant))
      router.push(`/quiz/${data.quiz.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center mx-auto mb-4">
              <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Join a Quiz</h1>
            <p className="text-[--muted] text-sm">Enter the access code from your quiz host.</p>
          </div>

          <Card className="p-5 sm:p-6">
            <form onSubmit={join} className="space-y-5">
              <Input
                label="Access Code"
                placeholder="KB-XXXXX"
                value={form.accessCode}
                onChange={e => setForm(p => ({ ...p, accessCode: e.target.value.toUpperCase() }))}
                className="text-center text-lg tracking-widest uppercase font-bold font-mono"
                required
              />

              <Input
                label="Your Name"
                placeholder="Display name on leaderboard"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />

              <Input
                label="Lightning Address"
                placeholder="you@walletofsatoshi.com"
                value={form.lightningAddress}
                onChange={e => setForm(p => ({ ...p, lightningAddress: e.target.value }))}
                helpText="Your Bitcoin wallet to receive sats if you win"
                required
              />

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[--error] text-sm text-center">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                loading={loading}
                disabled={!form.accessCode || !form.name || !form.lightningAddress}
                fullWidth
                size="lg"
              >
                <Zap size={16} fill="currentColor" /> Enter Quiz
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
