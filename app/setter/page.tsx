'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Zap, Users, HelpCircle, Trash2, Settings, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, PageContainer, StatusBadge } from '@/components/common'
import { Button, Card } from '@/components/ui'

interface QuizItem {
  id: string
  title: string
  description: string | null
  accessCode: string
  rewardSats: number
  status: string
  createdAt: string
  _count: { questions: number; participants: number }
}

export default function SetterDashboard() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchQuizzes = useCallback(async () => {
    const res = await fetch('/api/quiz')
    const data = await res.json()
    setQuizzes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchQuizzes() }, [fetchQuizzes])

  async function handleDelete(quizId: string) {
    setDeleting(true)
    await fetch(`/api/quiz/${quizId}/details`, { method: 'DELETE' })
    setDeleteId(null)
    setDeleting(false)
    fetchQuizzes()
  }

  function copyLink(quizId: string) {
    const url = `${window.location.origin}/quiz/${quizId}/join`
    navigator.clipboard.writeText(url)
    setCopiedId(quizId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="min-h-screen">
      <Header />

      <PageContainer maxWidth="xl">
        {/* Title + Create */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Your Quizzes</h1>
            <p className="text-[--muted] text-sm">Create, manage, and share quiz competitions.</p>
          </div>
          <Link href="/setter/new">
            <Button size="md">
              <Plus size={16} /> New Quiz
            </Button>
          </Link>
        </motion.div>

        {/* Quiz List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="shimmer h-28" />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-[--surface-2] flex items-center justify-center mx-auto mb-5">
              <HelpCircle size={28} className="text-[--muted]" />
            </div>
            <p className="text-[--muted] text-base mb-6">No quizzes yet. Create your first one!</p>
            <Link href="/setter/new">
              <Button size="lg">
                <Plus size={16} /> Create Your First Quiz
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {quizzes.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card hover className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3">
                      {/* Top row: title + status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              href={`/setter/${quiz.id}/manage`}
                              className="font-display font-bold text-base hover:text-[--btc] transition-colors truncate"
                            >
                              {quiz.title}
                            </Link>
                            <StatusBadge status={quiz.status} />
                          </div>
                          {quiz.description && (
                            <p className="text-[--muted] text-xs truncate">{quiz.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[--muted]">
                        <span className="font-mono text-[--btc] font-medium">{quiz.accessCode}</span>
                        <span className="flex items-center gap-1">
                          <HelpCircle size={11} /> {quiz._count.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {quiz._count.participants} joined
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={11} className="text-[--btc]" /> {quiz.rewardSats.toLocaleString()} sats
                        </span>
                      </div>

                      {/* Actions row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Link href={`/setter/${quiz.id}/manage`}>
                          <Button variant="secondary" size="sm">
                            <Settings size={12} /> Manage
                          </Button>
                        </Link>
                        <Link href={`/setter/${quiz.id}/questions`}>
                          <Button variant="ghost" size="sm">
                            Questions ({quiz._count.questions})
                          </Button>
                        </Link>
                        {quiz.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLink(quiz.id)}
                          >
                            {copiedId === quiz.id
                              ? <><CheckCircle size={12} className="text-[--success]" /> Copied!</>
                              : <><Copy size={12} /> Share Link</>
                            }
                          </Button>
                        )}
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(quiz.id)}
                          className="text-[--muted] hover:text-[--error]"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[--surface] border border-[--border] rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="font-display font-bold text-lg mb-2">Delete Quiz?</h3>
              <p className="text-[--muted] text-sm mb-6">
                This will permanently delete the quiz, all questions, participants, and answers.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting}
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1"
                >
                  Delete Quiz
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
