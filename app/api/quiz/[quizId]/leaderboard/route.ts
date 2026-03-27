import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params

  const participants = await prisma.participant.findMany({
    where: { quizId },
    orderBy: [{ score: 'desc' }, { completedAt: 'asc' }],
    select: {
      id: true,
      name: true,
      score: true,
      currentQuestion: true,
      completedAt: true,
    },
  })

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { status: true, rewardSats: true, _count: { select: { questions: true } } },
  })

  return NextResponse.json({ participants, quiz })
}
