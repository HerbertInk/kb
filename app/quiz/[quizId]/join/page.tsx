'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Zap, Users, Trophy, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '@/components/ui'

interface QuizInfo {
  id: string
  title: string
  description: string | null
  rewardSats: number
  status: string
  _count: { questions: number; participants: number }
}

export default function DirectJoinPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const router = useRouter()

  const [quiz, setQuiz] = useState<QuizInfo | null>(null)
  const [loadingQuiz, setLoadingQuiz] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', lightningAddress: '' })
  const [joining, setJoining] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/quiz/${quizId}/details`)
      const data = await res.json()
      if (data.error) {
        setError('Quiz not found')
      } else {
        setQuiz(data)
        setParticipantCount(data._count?.participants ?? 0)
      }
    } catch {
      setError('Failed to load quiz')
    } finally {
      setLoadingQuiz(false)
    }
  }, [quizId])

  useEffect(() => {
    fetchQuiz()
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}/details`)
        const data = await res.json()
        if (data._count) setParticipantCount(data._count.participants)
      } catch { /* ignore */ }
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchQuiz, quizId])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setJoining(true)
    setError('')
    try {
      const res = await fetch('/api/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, name: form.name, lightningAddress: form.lightningAddress }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      sessionStorage.setItem('participant', JSON.stringify(data.participant))
      router.push(`/quiz/${quizId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to join')
    } finally {
      setJoining(false)
    }
  }

  if (loadingQuiz) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-[--btc] animate-spin" />
      </main>
    )
  }

  if (!quiz || quiz.status === 'ended') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[--surface-2] flex items-center justify-center mb-5">
          <Zap size={24} className="text-[--muted]" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{!quiz ? 'Quiz Not Found' : 'Quiz Has Ended'}</h1>
        <p className="text-[--muted] text-sm mb-6">{!quiz ? 'This link is invalid.' : 'This quiz is no longer accepting participants.'}</p>
        <a href="/" className="text-[--btc] text-sm hover:underline">← Back to Home</a>
      </main>
    )
  }

  if (quiz.status === 'draft') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[--btc]/10 flex items-center justify-center mb-5 animate-pulse-glow">
          <Zap size={24} className="text-[--btc]" fill="currentColor" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-[--muted] text-sm mb-6">This quiz hasn&apos;t started yet. Hang tight!</p>
        <div className="inline-flex items-center gap-2 bg-[--surface-2] px-4 py-2 rounded-full text-xs text-[--muted]">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          Waiting for host to start...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[--border] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center">
            <Zap size={14} className="text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-sm">KB<span className="text-[--btc]">.</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[--muted]">
          <Users size={12} />
          <span>{participantCount} joined</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Quiz info */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[--btc] to-[--btc-dim] mb-5 animate-pulse-glow"
            >
              <Zap size={28} className="text-white" fill="currentColor" />
            </motion.div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{quiz.title}</h1>
            {quiz.description && <p className="text-[--muted] text-sm mb-4">{quiz.description}</p>}
            <div className="flex items-center justify-center gap-4 text-xs text-[--muted]">
              <span className="flex items-center gap-1"><Trophy size={12} className="text-[--btc]" /> {quiz.rewardSats.toLocaleString()} sats</span>
              <span>{quiz._count.questions} questions</span>
              <span className="flex items-center gap-1"><Users size={12} /> {participantCount} playing</span>
            </div>
          </div>

          {/* Join form */}
          <Card className="p-5 sm:p-6">
            <form onSubmit={handleJoin} className="space-y-5">
              <Input
                label="Your Name"
                placeholder="Enter your display name"
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
              {error && <p className="text-[--error] text-sm text-center">{error}</p>}
              <Button type="submit" loading={joining} disabled={!form.name || !form.lightningAddress} fullWidth size="lg">
                <Zap size={18} fill="currentColor" /> Join Quiz
              </Button>
            </form>
          </Card>

          <p className="text-center text-[--muted] text-[10px] mt-8 tracking-wider">Powered by Bitcoin Lightning Network</p>
        </motion.div>
      </div>
    </main>
  )
}
