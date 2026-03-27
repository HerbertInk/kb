import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
  const { questionId } = await params
  const body = await req.json()

  const question = await prisma.question.findUnique({ where: { id: questionId } })
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updateData: Record<string, unknown> = {}
  if (body.text !== undefined) updateData.text = body.text
  if (body.optionA !== undefined) updateData.optionA = body.optionA
  if (body.optionB !== undefined) updateData.optionB = body.optionB
  if (body.optionC !== undefined) updateData.optionC = body.optionC
  if (body.optionD !== undefined) updateData.optionD = body.optionD
  if (body.correctOption !== undefined) updateData.correctOption = body.correctOption.toUpperCase()

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: updateData,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
  const { quizId, questionId } = await params

  // Delete answers for this question first
  await prisma.answer.deleteMany({ where: { questionId } })
  await prisma.question.delete({ where: { id: questionId } })

  // Reorder remaining questions
  const remaining = await prisma.question.findMany({
    where: { quizId },
    orderBy: { order: 'asc' },
  })

  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].order !== i + 1) {
      await prisma.question.update({
        where: { id: remaining[i].id },
        data: { order: i + 1 },
      })
    }
  }

  return NextResponse.json({ success: true })
}
