import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
  const { participantId, questionId, selectedOption } = await req.json()

  const question = await prisma.question.findUnique({ where: { id: questionId } })
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  const isCorrect = question.correctOption === selectedOption.toUpperCase()

  await prisma.answer.create({
    data: { participantId, questionId, selectedOption, isCorrect },
  })

  const participant = await prisma.participant.update({
    where: { id: participantId },
    data: {
      score: { increment: isCorrect ? 1 : 0 },
      currentQuestion: { increment: 1 },
    },
  })

  const totalQuestions = await prisma.question.count({ where: { quizId } })
  if (participant.currentQuestion >= totalQuestions) {
    await prisma.participant.update({
      where: { id: participantId },
      data: { completedAt: new Date() },
    })
  }

  return NextResponse.json({ isCorrect, score: participant.score })
}
