import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lightning } from '@/lib/lightning'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
  const { action } = await req.json()

  if (action === 'activate') {
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { status: 'active' },
    })
    return NextResponse.json(quiz)
  }

  if (action === 'end') {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { status: 'ended' },
    })

    const winner = await prisma.participant.findFirst({
      where: { quizId },
      orderBy: [{ score: 'desc' }, { completedAt: 'asc' }],
    })

    if (!winner) return NextResponse.json({ message: 'No participants' })

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    const result = await lightning.sendPayment(
      winner.lightningAddress,
      quiz.rewardSats,
      `KB Quiz reward: ${quiz.title}`
    )

    return NextResponse.json({
      winner: { name: winner.name, score: winner.score, lightningAddress: winner.lightningAddress },
      payout: result,
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
