'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/common'
import { Card } from '@/components/ui'

interface ParticipantEntry { id: string; name: string; score: number; currentQuestion: number; completedAt: string | null }
interface QuizInfo { status: string; rewardSats: number; _count: { questions: number } }

export default function LeaderboardPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const [participants, setParticipants] = useState<ParticipantEntry[]>([])
  const [quiz, setQuiz] = useState<QuizInfo | null>(null)
  const [myId] = useState(() => {
    if (typeof window === 'undefined') return null
    const p = sessionStorage.getItem('participant')
    return p ? JSON.parse(p).id : null
  })

  const poll = useCallback(async () => {
    const res = await fetch(`/api/quiz/${quizId}/leaderboard`)
    const data = await res.json()
    setParticipants(data.participants)
    setQuiz(data.quiz)
  }, [quizId])

  useEffect(() => {
    poll()
    const id = setInterval(poll, 3000)
    return () => clearInterval(id)
  }, [poll])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-[--btc]" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Leaderboard</h1>
          </div>
          {quiz && (
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${quiz.status === 'ended' ? 'bg-[--btc]/15 text-[--btc]' : 'bg-emerald-500/15 text-emerald-400'}`}>
              {quiz.status === 'ended' ? 'Final Results' : '● Live'}
            </span>
          )}
        </motion.div>

        {/* Winner banner */}
        {quiz?.status === 'ended' && participants[0] && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card glow className="p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-white" fill="currentColor" />
                </div>
                <div>
                  <p className="text-[--btc] font-bold">Winner: {participants[0].name} — {participants[0].score} pts</p>
                  <p className="text-[--muted] text-xs mt-0.5">Lightning payout of {quiz.rewardSats?.toLocaleString()} sats sent ⚡</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Table */}
        {!participants.length ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-[--btc]/30 border-t-[--btc] rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <Card>
            <div className="grid grid-cols-[40px_1fr_60px_70px] sm:grid-cols-[40px_1fr_80px_80px] text-xs font-medium text-[--muted] px-4 sm:px-5 py-3 border-b border-[--border]">
              <span>#</span><span>Name</span><span className="text-right">Score</span><span className="text-right">Status</span>
            </div>
            {participants.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-[40px_1fr_60px_70px] sm:grid-cols-[40px_1fr_80px_80px] px-4 sm:px-5 py-3.5 border-b border-[--border] items-center ${
                  p.id === myId ? 'bg-[--btc]/5' : ''
                } ${i === 0 ? 'text-[--btc]' : ''}`}
              >
                <span className="font-mono font-bold text-sm">{i < 3 ? medals[i] : i + 1}</span>
                <span className="text-sm font-medium truncate pr-2">
                  {p.name}{p.id === myId && <span className="text-xs text-[--muted] ml-1">(you)</span>}
                </span>
                <span className="text-right font-mono font-bold text-lg">{p.score}</span>
                <span className="text-right text-xs text-[--muted]">{p.completedAt ? '✓ done' : `Q${p.currentQuestion + 1}`}</span>
              </motion.div>
            ))}
          </Card>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-[--muted] text-sm hover:text-[--btc] transition-colors">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
