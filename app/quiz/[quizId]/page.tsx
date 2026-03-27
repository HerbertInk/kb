'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'

const OPTIONS = ['A', 'B', 'C', 'D'] as const
const OPTION_COLORS = ['bg-blue-500/10 border-blue-500/30 hover:border-blue-400', 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400', 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400', 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400']
const OPTION_SELECTED_COLORS = ['border-blue-400 bg-blue-500/20 text-blue-300', 'border-emerald-400 bg-emerald-500/20 text-emerald-300', 'border-purple-400 bg-purple-500/20 text-purple-300', 'border-orange-400 bg-orange-500/20 text-orange-300']

interface Participant { id: string; currentQuestion: number; score: number }
interface Question { id: string; text: string; optionA: string; optionB: string; optionC: string; optionD: string; order: number }

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const router = useRouter()

  const [participant, setParticipant] = useState<Participant | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<{ isCorrect: boolean; score: number } | null>(null)
  const [done, setDone] = useState(false)

  const loadQuestions = useCallback(async (p: Participant) => {
    const res = await fetch(`/api/quiz/${quizId}/questions`)
    const qs: Question[] = await res.json()
    setQuestions(qs)
    const next = qs[p.currentQuestion]
    if (!next) setDone(true)
    else setQuestion(next)
  }, [quizId])

  useEffect(() => {
    const p = sessionStorage.getItem('participant')
    if (!p) { router.push('/quiz/join'); return }
    const parsed = JSON.parse(p)
    setParticipant(parsed)
    loadQuestions(parsed)
  }, [router, loadQuestions])

  async function submitAnswer() {
    if (!selected || !participant || !question) return
    const res = await fetch(`/api/quiz/${quizId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: participant.id, questionId: question.id, selectedOption: selected }),
    })
    const data = await res.json()
    setResult(data)
    const updated = { ...participant, currentQuestion: participant.currentQuestion + 1, score: data.score }
    setParticipant(updated)
    sessionStorage.setItem('participant', JSON.stringify(updated))
    setTimeout(() => {
      const nextQ = questions[updated.currentQuestion]
      if (!nextQ) { setDone(true) } else { setQuestion(nextQ); setSelected(null); setResult(null) }
    }, 1200)
  }

  if (!participant) return null

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center mb-6 animate-pulse-glow">
            <Zap size={36} className="text-white" fill="currentColor" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Quiz Complete!</h1>
          <p className="text-[--muted] mb-1">Your score</p>
          <p className="text-5xl font-bold text-[--btc] font-mono mb-1">{participant.score}</p>
          <p className="text-[--muted] text-sm mb-8">out of {questions.length}</p>
          <Link href={`/quiz/${quizId}/leaderboard`}>
            <Button size="lg">View Leaderboard <ChevronRight size={16} /></Button>
          </Link>
        </motion.div>
      </main>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[--btc]/30 border-t-[--btc] rounded-full animate-spin" />
      </div>
    )
  }

  const qIndex = participant.currentQuestion
  const progress = (qIndex / questions.length) * 100

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[--border] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[--btc] to-[--btc-dim] flex items-center justify-center">
            <Zap size={14} className="text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-sm">KB<span className="text-[--btc]">.</span></span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[--muted]">Score: <span className="text-[--btc] font-bold font-mono">{participant.score}</span></span>
          <span className="bg-[--surface-2] px-2.5 py-1 rounded-full text-xs font-medium text-[--muted-light]">Q{qIndex + 1}/{questions.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-[--surface-2]">
        <motion.div className="h-full bg-gradient-to-r from-[--btc] to-[--btc-light] rounded-r-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl">
            <p className="text-[--muted] text-xs font-medium mb-3">Question {qIndex + 1} of {questions.length}</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-8 leading-snug">{question.text}</h2>

            <div className="space-y-3">
              {OPTIONS.map((opt, idx) => {
                const text = question[`option${opt}` as keyof Question] as string
                const isSelected = selected === opt
                return (
                  <motion.button
                    key={opt}
                    whileTap={!result ? { scale: 0.98 } : undefined}
                    onClick={() => !result && setSelected(opt)}
                    disabled={!!result}
                    className={`w-full flex items-center gap-3 border rounded-xl p-4 text-left transition-all ${
                      result
                        ? isSelected && result.isCorrect ? 'border-[--success] bg-emerald-500/15 text-[--success]'
                          : isSelected && !result.isCorrect ? 'border-[--error] bg-red-500/15 text-[--error]'
                          : 'border-[--border] text-[--muted] opacity-60'
                        : isSelected ? OPTION_SELECTED_COLORS[idx]
                        : `border-[--border] text-[--text] ${OPTION_COLORS[idx]}`
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg shrink-0 ${
                      isSelected ? 'bg-current/20' : 'bg-[--surface-2]'
                    }`}>{opt}</span>
                    <span className="text-sm font-medium">{text}</span>
                  </motion.button>
                )
              })}
            </div>

            {result && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 text-sm font-bold ${result.isCorrect ? 'text-[--success]' : 'text-[--error]'}`}>
                {result.isCorrect ? '✓ Correct!' : '✗ Incorrect'} — Next question loading...
              </motion.p>
            )}

            {!result && selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Button onClick={submitAnswer} fullWidth size="lg">
                  Submit Answer <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
