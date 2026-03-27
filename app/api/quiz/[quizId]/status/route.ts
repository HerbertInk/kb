import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lightning } from '@/lib/lightning'

async function attemptPayout(quizId: string) {
  const winner = await prisma.participant.findFirst({
    where: { quizId },
    orderBy: [{ score: 'desc' }, { completedAt: 'asc' }],
  })

  if (!winner) {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { payoutStatus: 'failed', payoutError: 'No participants found' },
    })
    return { success: false, error: 'No participants' }
  }

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (!quiz) return { success: false, error: 'Quiz not found' }

  // Mark payout as pending
  await prisma.quiz.update({
    where: { id: quizId },
    data: {
      payoutStatus: 'pending',
      payoutError: null,
      winnerName: winner.name,
      winnerScore: winner.score,
    },
  })

  try {
    const result = await lightning.sendPayment(
      winner.lightningAddress,
      quiz.rewardSats,
      `KB Quiz reward: ${quiz.title}`
    )

    // Mark payout as success
    await prisma.quiz.update({
      where: { id: quizId },
      data: {
        payoutStatus: 'success',
        payoutHash: result.paymentHash,
        payoutError: null,
      },
    })

    return {
      success: true,
      winner: {
        name: winner.name,
        score: winner.score,
        lightningAddress: winner.lightningAddress,
      },
      payout: result,
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown payment error'

    // Mark payout as failed
    await prisma.quiz.update({
      where: { id: quizId },
      data: {
        payoutStatus: 'failed',
        payoutError: errorMessage,
      },
    })

    return { success: false, error: errorMessage }
  }
}

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
    // End the quiz
    await prisma.quiz.update({
      where: { id: quizId },
      data: { status: 'ended' },
    })

    // Attempt payout
    const result = await attemptPayout(quizId)
    return NextResponse.json(result)
  }

  if (action === 'retry-payout') {
    // Retry a failed payout
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    if (quiz.status !== 'ended') return NextResponse.json({ error: 'Quiz must be ended' }, { status: 400 })
    if (quiz.payoutStatus === 'success') return NextResponse.json({ error: 'Already paid' }, { status: 400 })

    const result = await attemptPayout(quizId)
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
