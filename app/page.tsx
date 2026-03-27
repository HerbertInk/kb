'use client'

import Link from 'next/link'
import { Zap, BookOpen, Trophy, ArrowRight, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/common'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-[--btc]/10 text-[--btc] text-xs px-4 py-2 mb-6 sm:mb-8 rounded-full font-medium"
        >
          <Zap size={12} fill="currentColor" /> Lightning Network Rewards
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-5 tracking-tight leading-[1.1]"
        >
          Win Bitcoin.<br />
          <span className="text-gradient-btc">Prove You Know.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-[--muted] max-w-lg mb-10 sm:mb-12 text-base leading-relaxed px-4"
        >
          Create quiz competitions for your class or team. Top scorer gets paid in sats — instantly, via Lightning Network.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/quiz/join"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[--btc] to-[--btc-dim] text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:shadow-[0_4px_24px_rgba(247,147,26,0.35)] transition-all active:scale-[0.97]"
          >
            Join a Quiz <ArrowRight size={16} />
          </Link>
          <Link
            href="/setter"
            className="flex items-center justify-center gap-2 bg-[--surface-2] border border-[--border] text-[--text] font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-[--btc] hover:text-[--btc] transition-all active:scale-[0.97]"
          >
            Create a Quiz
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="border-t border-[--border] px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium text-[--muted] mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <BookOpen size={22} />,
                title: 'Take the Quiz',
                desc: 'Answer multiple-choice questions. One at a time. Real-time scoring.',
              },
              {
                icon: <Trophy size={22} />,
                title: 'Top the Board',
                desc: 'Live leaderboard ranks all participants by score and speed.',
              },
              {
                icon: <Zap size={22} />,
                title: 'Get Paid in Sats',
                desc: 'Winner receives Bitcoin via Lightning Network. Instant payout.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.4 }}
                className="card-glass p-6 hover-lift group"
              >
                <div className="w-10 h-10 rounded-lg bg-[--btc]/10 flex items-center justify-center mb-4 text-[--btc] group-hover:bg-[--btc]/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[--muted] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats strip */}
      <section className="border-t border-[--border] grid grid-cols-3 divide-x divide-[--border]">
        {[
          { icon: <BookOpen size={16} />, label: 'MCQ Format', sub: 'Objective only' },
          { icon: <Shield size={16} />, label: 'Fair Play', sub: 'One at a time' },
          { icon: <Zap size={16} />, label: 'Lightning Fast', sub: 'Sat rewards' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center py-6 gap-1.5">
            <span className="text-[--btc]">{item.icon}</span>
            <span className="text-xs font-semibold text-[--text]">{item.label}</span>
            <span className="text-[--muted] text-xs">{item.sub}</span>
          </div>
        ))}
      </section>
    </main>
  )
}
