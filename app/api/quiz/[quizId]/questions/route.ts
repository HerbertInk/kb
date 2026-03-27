import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
  const { text, optionA, optionB, optionC, optionD, correctOption } = await req.json()

  if (!text || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const count = await prisma.question.count({ where: { quizId } })

  const question = await prisma.question.create({
    data: {
      quizId,
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption: correctOption.toUpperCase(),
      order: count + 1,
    },
  })

  return NextResponse.json(question, { status: 201 })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
  const questions = await prisma.question.findMany({
    where: { quizId },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(questions)
}
