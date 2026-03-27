import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAccessCode } from '@/lib/utils'

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { questions: true, participants: true } },
    },
  })
  return NextResponse.json(quizzes)
}

export async function POST(req: NextRequest) {
  const { title, description, rewardSats, senderWalletId } = await req.json()

  if (!title || !rewardSats) {
    return NextResponse.json({ error: 'title and rewardSats required' }, { status: 400 })
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      rewardSats: Number(rewardSats),
      accessCode: generateAccessCode(),
      setterFeePaid: true,
      senderWalletId: senderWalletId || null,
    },
  })

  return NextResponse.json(quiz, { status: 201 })
}
