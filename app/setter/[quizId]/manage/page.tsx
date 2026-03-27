'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Copy, Zap, Users, CheckCircle, ExternalLink, Trash2, Pencil, X, Check, Link2, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, PageContainer, StatusBadge } from '@/components/common'
import { Button, Card } from '@/components/ui'

interface QuizDetails {
  id: string
  title: string
  description: string | null
  accessCode: string
  rewardSats: number
  status: string
  _count: { questions: number; participants: number }
}

export default function ManageQuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const router = useRouter()

  const [quiz, setQuiz] = useState<QuizDetails | null>(null)
  const [leaderboard, setLeaderboard] = useState<Record<string, unknown>[]>([])
  const [payout, setPayout] = useState<Record<string, Record<string, unknown>> | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', rewardSats: '' })
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchDetails = useCallback(async () => {
    const res = await fetch(`/api/quiz/${quizId}/details`)
    const data = await res.json()
    if (data.id) setQuiz(data)
  }, [quizId])

  const fetchLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/quiz/${quizId}/leaderboard`)
    const data = await res.json()
    setLeaderboard(data.participants)
  }, [quizId])

  useEffect(() => {
    fetchDetails()
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 3000)
    return () => clearInterval(interval)
  }, [fetchDetails, fetchLeaderboard])

  async function updateStatus(action: 'activate' | 'end') {
    const res = await fetch(`/api/quiz/${quizId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    if (action === 'end' && data.winner) setPayout(data)
    fetchDetails()
    fetchLeaderboard()
  }

  function startEditing() {
    if (!quiz) return
    setEditForm({ title: quiz.title, description: quiz.description || '', rewardSats: String(quiz.rewardSats) })
    setEditing(true)
  }

  async function saveQuiz(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/quiz/${quizId}/details`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editForm.title, description: editForm.description || null, rewardSats: Number(editForm.rewardSats) }),
    })
    setSaving(false)
    setEditing(false)
    fetchDetails()
  }

  async function deleteQuiz() {
    setDeleting(true)
    await fetch(`/api/quiz/${quizId}/details`, { method: 'DELETE' })
    router.push('/setter')
  }

  function copyCode() {
    if (!quiz) return
    navigator.clipboard.writeText(quiz.accessCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  function copyShareLink() {
    const url = `${window.location.origin}/quiz/${quizId}/join`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!quiz) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[--btc]/30 border-t-[--btc] rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${quizId}/join` : `/quiz/${quizId}/join`

  return (
    <main className="min-h-screen">
      <Header />

      <PageContainer maxWidth="xl">
        <div className="space-y-6">

          {/* Title + Actions */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {editing ? (
              <Card className="p-5">
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Pencil size={16} className="text-[--btc]" /> Edit Quiz
                </h2>
                <form onSubmit={saveQuiz} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[--muted-light] mb-1">Title</label>
                    <input className="kb-input" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[--muted-light] mb-1">Description</label>
                    <textarea className="kb-input h-16 resize-none" value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[--muted-light] mb-1">Reward (sats)</label>
                    <input className="kb-input" type="number" value={editForm.rewardSats} onChange={e => setEditForm(p => ({ ...p, rewardSats: e.target.value }))} required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" loading={saving}><Check size={14} /> Save Changes</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}><X size={14} /> Cancel</Button>
                  </div>
                </form>
              </Card>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold">{quiz.title}</h1>
                    <StatusBadge status={quiz.status} />
                  </div>
                  {quiz.description && <p className="text-[--muted] text-sm">{quiz.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={startEditing}><Pencil size={12} /> Edit</Button>
                  <Link href={`/setter/${quizId}/questions`}><Button variant="ghost" size="sm">Questions</Button></Link>
                  <Button variant="ghost" size="sm" onClick={() => setShowDelete(true)} className="hover:text-[--error]"><Trash2 size={13} /></Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Share Section */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card glow={quiz.status === 'active'} className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={16} className="text-[--btc]" />
                <h2 className="font-display font-bold">Share with Students</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[--muted]">Access Code</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl sm:text-2xl font-mono font-bold text-[--btc] tracking-widest">{quiz.accessCode}</p>
                    <Button variant="ghost" size="sm" onClick={copyCode}>
                      {copiedCode ? <><CheckCircle size={14} className="text-[--success]" /> Copied</> : <><Copy size={14} /> Copy</>}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[--muted]">Direct Join Link</p>
                  <div className="flex items-center gap-2">
                    <div className="kb-input text-xs truncate flex-1 flex items-center gap-2 py-2.5">
                      <Link2 size={12} className="text-[--btc] shrink-0" />
                      <span className="truncate font-mono">{shareUrl}</span>
                    </div>
                    <Button size="sm" onClick={copyShareLink}>
                      {copiedLink ? <><CheckCircle size={12} /> Copied</> : <><ExternalLink size={12} /> Copy</>}
                    </Button>
                  </div>
                  <p className="text-xs text-[--muted]">Students click this link to join directly</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 space-y-4">
              <h2 className="font-display font-bold text-lg">Controls</h2>
              <p className="text-[--muted] text-sm">
                {quiz._count.questions} questions · {quiz.rewardSats.toLocaleString()} sats · {quiz._count.participants} participants
              </p>
              <div className="flex flex-wrap gap-3">
                {quiz.status === 'draft' && quiz._count.questions > 0 && (
                  <Button variant="success" onClick={() => updateStatus('activate')}>Activate Quiz</Button>
                )}
                {quiz.status === 'draft' && quiz._count.questions === 0 && (
                  <Link href={`/setter/${quizId}/questions`}><Button>Add Questions First</Button></Link>
                )}
                {quiz.status === 'active' && (
                  <Button variant="danger" onClick={() => updateStatus('end')}>End Quiz + Pay Winner</Button>
                )}
                {quiz.status === 'ended' && (
                  <p className="text-[--muted] text-sm flex items-center gap-2"><CheckCircle size={14} className="text-[--success]" /> Quiz ended</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <div className="px-5 py-4 border-b border-[--border] flex items-center justify-between">
                <h2 className="font-display font-bold flex items-center gap-2"><Users size={16} /> Live Leaderboard</h2>
                <span className="text-[--muted] text-xs">{leaderboard.length} participants</span>
              </div>
              {leaderboard.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-[--muted] text-sm">No participants yet. Share the link above!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[--muted] text-xs border-b border-[--border]">
                        <th className="px-5 py-3 text-left">#</th>
                        <th className="px-5 py-3 text-left">Name</th>
                        <th className="px-5 py-3 text-right">Score</th>
                        <th className="px-5 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((p, i) => (
                        <tr key={p.id as string} className={`border-b border-[--border] ${i === 0 ? 'text-[--btc]' : ''}`}>
                          <td className="px-5 py-3 font-mono">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                          <td className="px-5 py-3 font-medium">{p.name as string}</td>
                          <td className="px-5 py-3 text-right font-mono font-bold">{p.score as number}</td>
                          <td className="px-5 py-3 text-right text-[--muted]">{p.completedAt ? '✓' : `Q${(p.currentQuestion as number) + 1}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Payout */}
          <AnimatePresence>
            {payout && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card glow className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-[--btc]" fill="currentColor" />
                    <h2 className="font-display font-bold text-[--btc]">Lightning Payout Sent!</h2>
                  </div>
                  <p className="text-sm">Winner: <strong>{payout.winner.name as string}</strong> — {payout.winner.score as number} pts</p>
                  <p className="text-[--muted] text-xs mt-1 font-mono break-all">{payout.payout.paymentHash as string}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageContainer>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-[--surface] border border-[--border] rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-display font-bold text-lg mb-2">Delete &quot;{quiz.title}&quot;?</h3>
              <p className="text-[--muted] text-sm mb-6">This will permanently delete everything. Cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => setShowDelete(false)} className="flex-1">Cancel</Button>
                <Button variant="danger" size="sm" loading={deleting} onClick={deleteQuiz} className="flex-1">Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
