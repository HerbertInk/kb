import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.answer.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()

  // Quiz 1: Bitcoin Basics (active, ready to play)
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Bitcoin Basics',
      description: 'Test your knowledge of Bitcoin fundamentals',
      accessCode: 'KB-BTC01',
      rewardSats: 10000,
      setterFeePaid: true,
      status: 'active',
    },
  })

  const q1Questions = [
    {
      text: 'Who created Bitcoin?',
      optionA: 'Vitalik Buterin',
      optionB: 'Satoshi Nakamoto',
      optionC: 'Elon Musk',
      optionD: 'Hal Finney',
      correctOption: 'B',
      order: 1,
    },
    {
      text: 'What is the maximum supply of Bitcoin?',
      optionA: '21 million',
      optionB: '100 million',
      optionC: '18.5 million',
      optionD: 'Unlimited',
      correctOption: 'A',
      order: 2,
    },
    {
      text: 'What is a Bitcoin halving?',
      optionA: 'When Bitcoin price drops 50%',
      optionB: 'When the block reward is cut in half',
      optionC: 'When half the nodes go offline',
      optionD: 'When transaction fees double',
      correctOption: 'B',
      order: 3,
    },
    {
      text: 'What consensus mechanism does Bitcoin use?',
      optionA: 'Proof of Stake',
      optionB: 'Delegated Proof of Stake',
      optionC: 'Proof of Work',
      optionD: 'Proof of Authority',
      correctOption: 'C',
      order: 4,
    },
    {
      text: 'What is the smallest unit of Bitcoin called?',
      optionA: 'Wei',
      optionB: 'Gwei',
      optionC: 'Bit',
      optionD: 'Satoshi',
      correctOption: 'D',
      order: 5,
    },
  ]

  for (const q of q1Questions) {
    await prisma.question.create({ data: { quizId: quiz1.id, ...q } })
  }

  // Quiz 2: Lightning Network (active)
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Lightning Network Deep Dive',
      description: 'How well do you know Layer 2?',
      accessCode: 'KB-LN002',
      rewardSats: 25000,
      setterFeePaid: true,
      status: 'active',
    },
  })

  const q2Questions = [
    {
      text: 'What is the Lightning Network?',
      optionA: 'A new blockchain',
      optionB: 'A Layer 2 payment protocol on top of Bitcoin',
      optionC: 'An altcoin',
      optionD: 'A mining pool',
      correctOption: 'B',
      order: 1,
    },
    {
      text: 'What are Lightning payment channels?',
      optionA: 'On-chain wallets',
      optionB: 'Two-party multisig contracts enabling off-chain transactions',
      optionC: 'Mining rigs',
      optionD: 'Exchange accounts',
      correctOption: 'B',
      order: 2,
    },
    {
      text: 'What is an HTLC in Lightning?',
      optionA: 'Hyper Text Lightning Contract',
      optionB: 'Hash Time-Locked Contract',
      optionC: 'High Throughput Linked Chain',
      optionD: 'Hardware Token Locking Code',
      correctOption: 'B',
      order: 3,
    },
    {
      text: 'What does "routing" mean in Lightning Network?',
      optionA: 'Mining new blocks',
      optionB: 'Finding a path of channels to relay a payment',
      optionC: 'Sending Bitcoin on-chain',
      optionD: 'Creating a new wallet',
      correctOption: 'B',
      order: 4,
    },
  ]

  for (const q of q2Questions) {
    await prisma.question.create({ data: { quizId: quiz2.id, ...q } })
  }

  // Quiz 3: Cryptography 101 (draft - not yet active)
  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Cryptography 101',
      description: 'The math behind Bitcoin security',
      accessCode: 'KB-CRY03',
      rewardSats: 15000,
      setterFeePaid: true,
      status: 'draft',
    },
  })

  const q3Questions = [
    {
      text: 'What hashing algorithm does Bitcoin use?',
      optionA: 'MD5',
      optionB: 'SHA-256',
      optionC: 'SHA-3',
      optionD: 'Keccak-256',
      correctOption: 'B',
      order: 1,
    },
    {
      text: 'What type of cryptography is used for Bitcoin addresses?',
      optionA: 'Symmetric encryption',
      optionB: 'RSA',
      optionC: 'Elliptic Curve (secp256k1)',
      optionD: 'AES-256',
      correctOption: 'C',
      order: 2,
    },
    {
      text: 'What is a Merkle tree used for in Bitcoin?',
      optionA: 'Storing wallet passwords',
      optionB: 'Efficiently verifying transaction inclusion in a block',
      optionC: 'Generating new coins',
      optionD: 'Connecting to peers',
      correctOption: 'B',
      order: 3,
    },
  ]

  for (const q of q3Questions) {
    await prisma.question.create({ data: { quizId: quiz3.id, ...q } })
  }

  // Quiz 4: Ended quiz with participants and a winner
  const quiz4 = await prisma.quiz.create({
    data: {
      title: 'Bitcoin History — Week 1',
      description: 'From the whitepaper to the pizza',
      accessCode: 'KB-HIS04',
      rewardSats: 5000,
      setterFeePaid: true,
      status: 'ended',
    },
  })

  const q4Questions = [
    {
      text: 'When was the Bitcoin whitepaper published?',
      optionA: '2007',
      optionB: '2008',
      optionC: '2009',
      optionD: '2010',
      correctOption: 'B',
      order: 1,
    },
    {
      text: 'What was the first real-world Bitcoin transaction?',
      optionA: 'Buying a car',
      optionB: 'Paying rent',
      optionC: 'Buying two pizzas for 10,000 BTC',
      optionD: 'Buying a domain name',
      correctOption: 'C',
      order: 2,
    },
    {
      text: 'What is the Genesis Block?',
      optionA: 'The most expensive block ever mined',
      optionB: 'The first block in the Bitcoin blockchain',
      optionC: 'A type of hardware wallet',
      optionD: 'The block where Satoshi sent the first transaction',
      correctOption: 'B',
      order: 3,
    },
  ]

  for (const q of q4Questions) {
    await prisma.question.create({ data: { quizId: quiz4.id, ...q } })
  }

  // Add participants to the ended quiz
  const participant1 = await prisma.participant.create({
    data: {
      quizId: quiz4.id,
      name: 'Alice Nakamoto',
      lightningAddress: 'alice@walletofsatoshi.com',
      score: 3,
      currentQuestion: 3,
      completedAt: new Date('2026-03-25T10:30:00Z'),
    },
  })

  const participant2 = await prisma.participant.create({
    data: {
      quizId: quiz4.id,
      name: 'Bob Lightning',
      lightningAddress: 'bob@getalby.com',
      score: 2,
      currentQuestion: 3,
      completedAt: new Date('2026-03-25T10:32:00Z'),
    },
  })

  const participant3 = await prisma.participant.create({
    data: {
      quizId: quiz4.id,
      name: 'Charlie Blocks',
      lightningAddress: 'charlie@strike.me',
      score: 2,
      currentQuestion: 3,
      completedAt: new Date('2026-03-25T10:35:00Z'),
    },
  })

  const participant4 = await prisma.participant.create({
    data: {
      quizId: quiz4.id,
      name: 'Diana Sats',
      lightningAddress: 'diana@blink.sv',
      score: 1,
      currentQuestion: 3,
      completedAt: new Date('2026-03-25T10:28:00Z'),
    },
  })

  // Add answers for the ended quiz participants
  const q4Qs = await prisma.question.findMany({
    where: { quizId: quiz4.id },
    orderBy: { order: 'asc' },
  })

  // Alice: got all 3 correct
  for (const q of q4Qs) {
    await prisma.answer.create({
      data: {
        participantId: participant1.id,
        questionId: q.id,
        selectedOption: q.correctOption,
        isCorrect: true,
      },
    })
  }

  // Bob: got Q1 and Q2 correct, Q3 wrong
  await prisma.answer.create({ data: { participantId: participant2.id, questionId: q4Qs[0].id, selectedOption: 'B', isCorrect: true } })
  await prisma.answer.create({ data: { participantId: participant2.id, questionId: q4Qs[1].id, selectedOption: 'C', isCorrect: true } })
  await prisma.answer.create({ data: { participantId: participant2.id, questionId: q4Qs[2].id, selectedOption: 'A', isCorrect: false } })

  // Charlie: got Q1 wrong, Q2 and Q3 correct
  await prisma.answer.create({ data: { participantId: participant3.id, questionId: q4Qs[0].id, selectedOption: 'A', isCorrect: false } })
  await prisma.answer.create({ data: { participantId: participant3.id, questionId: q4Qs[1].id, selectedOption: 'C', isCorrect: true } })
  await prisma.answer.create({ data: { participantId: participant3.id, questionId: q4Qs[2].id, selectedOption: 'B', isCorrect: true } })

  // Diana: got only Q2 correct
  await prisma.answer.create({ data: { participantId: participant4.id, questionId: q4Qs[0].id, selectedOption: 'C', isCorrect: false } })
  await prisma.answer.create({ data: { participantId: participant4.id, questionId: q4Qs[1].id, selectedOption: 'C', isCorrect: true } })
  await prisma.answer.create({ data: { participantId: participant4.id, questionId: q4Qs[2].id, selectedOption: 'D', isCorrect: false } })

  // Add some participants to the active Bitcoin Basics quiz (in progress)
  await prisma.participant.create({
    data: {
      quizId: quiz1.id,
      name: 'Eve Hashrate',
      lightningAddress: 'eve@walletofsatoshi.com',
      score: 3,
      currentQuestion: 3,
    },
  })

  await prisma.participant.create({
    data: {
      quizId: quiz1.id,
      name: 'Frank Mempool',
      lightningAddress: 'frank@getalby.com',
      score: 2,
      currentQuestion: 4,
    },
  })

  console.log('✓ Database seeded successfully!')
  console.log('')
  console.log('Quizzes created:')
  console.log(`  1. "${quiz1.title}" [ACTIVE] — Code: ${quiz1.accessCode} (${q1Questions.length} questions, ${quiz1.rewardSats} sats)`)
  console.log(`  2. "${quiz2.title}" [ACTIVE] — Code: ${quiz2.accessCode} (${q2Questions.length} questions, ${quiz2.rewardSats} sats)`)
  console.log(`  3. "${quiz3.title}" [DRAFT]  — Code: ${quiz3.accessCode} (${q3Questions.length} questions, ${quiz3.rewardSats} sats)`)
  console.log(`  4. "${quiz4.title}" [ENDED]  — Code: ${quiz4.accessCode} (${q4Questions.length} questions, ${quiz4.rewardSats} sats)`)
  console.log('')
  console.log('You can join the active quizzes with these codes:')
  console.log(`  → KB-BTC01  (Bitcoin Basics — 10,000 sats reward)`)
  console.log(`  → KB-LN002  (Lightning Network — 25,000 sats reward)`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
