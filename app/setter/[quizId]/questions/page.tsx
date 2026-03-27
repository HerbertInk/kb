'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Plus, Trash2, Pencil, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, PageContainer } from '@/components/common'
import { Button, Card } from '@/components/ui'

const OPTIONS = ['A', 'B', 'C', 'D'] as const

const emptyForm = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A',
}

type QuestionForm = typeof emptyForm

export default function QuestionsPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const [form, setForm] = useState<QuestionForm>(emptyForm)
  const [questions, setQuestions] = useState<(QuestionForm & { id: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<QuestionForm>(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const fetchQuestions = useCallback(async () => {
    const res = await fetch(`/api/quiz/${quizId}/questions`)
    const data = await res.json()
    setQuestions(data)
  }, [quizId])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch(`/api/quiz/${quizId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm(emptyForm)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    await fetchQuestions()
    setLoading(false)
  }

  async function deleteQuestion(questionId: string) {
    setDeletingId(questionId)
    await fetch(`/api/quiz/${quizId}/questions/${questionId}`, { method: 'DELETE' })
    setDeletingId(null)
    await fetchQuestions()
  }

  function startEditing(q: QuestionForm & { id: string }) {
    setEditingId(q.id)
    setEditForm({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
    })
  }

  async function saveEdit(questionId: string) {
    setSavingEdit(true)
    await fetch(`/api/quiz/${quizId}/questions/${questionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setEditingId(null)
    setSavingEdit(false)
    await fetchQuestions()
  }

  const isValid = form.text && form.optionA && form.optionB && form.optionC && form.optionD

  return (
    <main className="min-h-screen">
      <Header />

      <PageContainer maxWidth="xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Questions</h1>
            <p className="text-[--muted] text-sm">{questions.length} question{questions.length !== 1 ? 's' : ''} added</p>
          </div>
          {questions.length > 0 && (
            <Link href={`/setter/${quizId}/manage`}>
              <Button size="sm">
                Manage Quiz <ArrowRight size={14} />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Add Question Form */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-5">
              <h2 className="font-display text-lg font-bold mb-5">Add Question</h2>
              <form onSubmit={addQuestion} className="space-y-4">
                <textarea
                  className="kb-input h-24 resize-none"
                  placeholder="Question text..."
                  value={form.text}
                  onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  required
                />

                {OPTIONS.map(opt => (
                  <div key={opt} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, correctOption: opt }))}
                      className={`w-9 h-9 shrink-0 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        form.correctOption === opt
                          ? 'bg-[--btc] text-white scale-110 shadow-[0_0_12px_rgba(247,147,26,0.3)]'
                          : 'bg-[--surface-2] border border-[--border] text-[--muted] hover:border-[--btc] hover:text-[--btc]'
                      }`}
                    >
                      {opt}
                    </button>
                    <input
                      className="kb-input"
                      placeholder={`Option ${opt}`}
                      value={form[`option${opt}` as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [`option${opt}`]: e.target.value }))}
                      required
                    />
                  </div>
                ))}

                <p className="text-[--muted] text-xs">Click a letter to mark it as the correct answer</p>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!isValid}
                  fullWidth
                >
                  {saved ? <><Check size={14} /> Saved!</> : <><Plus size={14} /> Add Question</>}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Question List */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2 className="font-display text-lg font-bold mb-5">Added Questions</h2>
            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-[--muted]">No questions yet. Add your first one!</p>
              </Card>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {questions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-4">
                        {editingId === q.id ? (
                          /* Edit mode */
                          <div className="space-y-3">
                            <textarea
                              className="kb-input h-16 resize-none text-sm"
                              value={editForm.text}
                              onChange={e => setEditForm(p => ({ ...p, text: e.target.value }))}
                            />
                            {OPTIONS.map(opt => (
                              <div key={opt} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditForm(p => ({ ...p, correctOption: opt }))}
                                  className={`w-7 h-7 shrink-0 rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${
                                    editForm.correctOption === opt
                                      ? 'bg-[--btc] text-white'
                                      : 'bg-[--surface-2] border border-[--border] text-[--muted]'
                                  }`}
                                >
                                  {opt}
                                </button>
                                <input
                                  className="kb-input text-sm py-2 px-3"
                                  value={editForm[`option${opt}` as keyof QuestionForm]}
                                  onChange={e => setEditForm(p => ({ ...p, [`option${opt}`]: e.target.value }))}
                                />
                              </div>
                            ))}
                            <div className="flex gap-2 pt-1">
                              <Button size="sm" variant="success" onClick={() => saveEdit(q.id)} loading={savingEdit}>
                                <Check size={12} /> Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X size={12} /> Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* View mode */
                          <>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex gap-2 min-w-0">
                                <span className="text-[--btc] text-xs font-bold shrink-0 mt-0.5">Q{i + 1}</span>
                                <p className="text-sm font-medium">{q.text}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => startEditing(q)}
                                  className="p-1.5 rounded-md text-[--muted] hover:text-[--btc] hover:bg-[--surface-2] transition-all"
                                  title="Edit"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => deleteQuestion(q.id)}
                                  disabled={deletingId === q.id}
                                  className="p-1.5 rounded-md text-[--muted] hover:text-[--error] hover:bg-red-500/10 transition-all disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-[--muted]">
                              {OPTIONS.map(opt => (
                                <span key={opt} className={q.correctOption === opt ? 'text-[--success] font-medium' : ''}>
                                  {opt}: {q[`option${opt}` as keyof typeof q] as string}
                                  {q.correctOption === opt && ' ✓'}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {questions.length > 0 && (
              <Link
                href={`/setter/${quizId}/manage`}
                className="mt-6 block"
              >
                <Button fullWidth variant="secondary" size="lg">
                  Continue to Manage Quiz <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </PageContainer>
    </main>
  )
}
