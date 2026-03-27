'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header, PageContainer } from '@/components/common'
import { Button, Input, Card } from '@/components/ui'

export default function NewQuizPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', rewardSats: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rewardSats: Number(form.rewardSats) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/setter/${data.id}/questions`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <PageContainer maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Create New Quiz</h1>
          <p className="text-[--muted] text-sm mb-8">Set up your quiz details. You can add questions after.</p>

          <Card className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Quiz Title"
                placeholder="e.g. Bitcoin Fundamentals — Week 4"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[--muted-light] mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="kb-input h-20 resize-none"
                  placeholder="Brief description for participants..."
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <Input
                label="Reward Amount"
                type="number"
                placeholder="10000"
                value={form.rewardSats}
                onChange={e => setForm(p => ({ ...p, rewardSats: e.target.value }))}
                rightElement={<span className="text-[--btc] text-xs font-bold">SATS</span>}
                helpText="Paid to the highest scorer via Lightning Network"
                required
              />

              {error && <p className="text-[--error] text-sm">{error}</p>}

              <Button
                type="submit"
                loading={loading}
                disabled={!form.title || !form.rewardSats}
                fullWidth
                size="lg"
              >
                Create Quiz & Add Questions <ArrowRight size={16} />
              </Button>
            </form>
          </Card>
        </motion.div>
      </PageContainer>
    </main>
  )
}
