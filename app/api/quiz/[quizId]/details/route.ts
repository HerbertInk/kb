import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { _count: { select: { questions: true, participants: true } } },
  })

  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(quiz)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
  const body = await req.json()

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updateData: Record<string, unknown> = {}
  if (body.title !== undefined) updateData.title = body.title
  if (body.description !== undefined) updateData.description = body.description
  if (body.rewardSats !== undefined) updateData.rewardSats = Number(body.rewardSats)

  const updated = await prisma.quiz.update({
    where: { id: quizId },
    data: updateData,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params

  // Cascade delete: answers → participants → questions → quiz
  await prisma.answer.deleteMany({
    where: { question: { quizId } },
  })
  await prisma.participant.deleteMany({ where: { quizId } })
  await prisma.question.deleteMany({ where: { quizId } })
  await prisma.quiz.delete({ where: { id: quizId } })

  return NextResponse.json({ success: true })
}
