import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { accessCode, quizId, name, lightningAddress } = await req.json()

  let quiz

  // Support joining by direct quizId (shareable link) or accessCode
  if (quizId) {
    quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  } else if (accessCode) {
    quiz = await prisma.quiz.findUnique({ where: { accessCode } })
  }

  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  if (quiz.status === 'ended') return NextResponse.json({ error: 'Quiz has ended' }, { status: 410 })
  if (quiz.status === 'draft') return NextResponse.json({ error: 'Quiz not yet active' }, { status: 403 })

  const participant = await prisma.participant.create({
    data: { quizId: quiz.id, name, lightningAddress },
  })

  return NextResponse.json({ participant, quiz }, { status: 201 })
}
