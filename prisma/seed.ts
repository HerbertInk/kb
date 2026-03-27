import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Wipe everything
  await prisma.answer.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()

  // ─── QUIZ 1: Bitcoin Basics (ACTIVE — ready for demo) ───
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Bitcoin Basics',
      description: 'How well do you know the fundamentals of Bitcoin?',
      accessCode: 'KB-BTC01',
      rewardSats: 500,
      setterFeePaid: true,
      status: 'active',
    },
  })

  for (const q of [
    { text: 'Who is the creator of Bitcoin?', optionA: 'Vitalik Buterin', optionB: 'Satoshi Nakamoto', optionC: 'Elon Musk', optionD: 'Hal Finney', correctOption: 'B', order: 1 },
    { text: 'What is the maximum supply of Bitcoin?', optionA: '21 million', optionB: '100 million', optionC: '18.5 million', optionD: 'Unlimited', correctOption: 'A', order: 2 },
    { text: 'What is a Bitcoin halving?', optionA: 'When Bitcoin price drops 50%', optionB: 'When the block reward is cut in half', optionC: 'When half the nodes go offline', optionD: 'When transaction fees double', correctOption: 'B', order: 3 },
    { text: 'What consensus mechanism does Bitcoin use?', optionA: 'Proof of Stake', optionB: 'Delegated Proof of Stake', optionC: 'Proof of Work', optionD: 'Proof of Authority', correctOption: 'C', order: 4 },
    { text: 'What is the smallest unit of Bitcoin called?', optionA: 'Wei', optionB: 'Gwei', optionC: 'Bit', optionD: 'Satoshi', correctOption: 'D', order: 5 },
  ]) {
    await prisma.question.create({ data: { quizId: quiz1.id, ...q } })
  }

  // ─── QUIZ 2: Lightning Network (ACTIVE — ready for demo) ───
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Lightning Network',
      description: 'Test your knowledge of Bitcoin Layer 2 scaling',
      accessCode: 'KB-LN002',
      rewardSats: 500,
      setterFeePaid: true,
      status: 'active',
    },
  })

  for (const q of [
    { text: 'What is the Lightning Network?', optionA: 'A new blockchain', optionB: 'A Layer 2 payment protocol on Bitcoin', optionC: 'An altcoin', optionD: 'A mining pool', correctOption: 'B', order: 1 },
    { text: 'What are Lightning payment channels?', optionA: 'On-chain wallets', optionB: 'Two-party multisig contracts for off-chain transactions', optionC: 'Mining rigs', optionD: 'Exchange accounts', correctOption: 'B', order: 2 },
    { text: 'What is an HTLC?', optionA: 'Hyper Text Lightning Contract', optionB: 'Hash Time-Locked Contract', optionC: 'High Throughput Linked Chain', optionD: 'Hardware Token Locking Code', correctOption: 'B', order: 3 },
    { text: 'What does "routing" mean in Lightning?', optionA: 'Mining new blocks', optionB: 'Finding a path of channels to relay a payment', optionC: 'Sending Bitcoin on-chain', optionD: 'Creating a new wallet', correctOption: 'B', order: 4 },
    { text: 'What is a Lightning Address?', optionA: 'A Bitcoin public key', optionB: 'An email-like identifier for receiving Lightning payments', optionC: 'A node IP address', optionD: 'A wallet seed phrase', correctOption: 'B', order: 5 },
  ]) {
    await prisma.question.create({ data: { quizId: quiz2.id, ...q } })
  }

  // ─── QUIZ 3: Blockchain & Crypto Security (ACTIVE — ready for demo) ───
  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Blockchain Security',
      description: 'Cryptography, wallets, and staying safe in crypto',
      accessCode: 'KB-SEC03',
      rewardSats: 500,
      setterFeePaid: true,
      status: 'active',
    },
  })

  for (const q of [
    { text: 'What hashing algorithm does Bitcoin use?', optionA: 'MD5', optionB: 'SHA-256', optionC: 'SHA-3', optionD: 'Keccak-256', correctOption: 'B', order: 1 },
    { text: 'What is a seed phrase used for?', optionA: 'To mine Bitcoin', optionB: 'To recover a wallet', optionC: 'To send transactions faster', optionD: 'To verify blocks', correctOption: 'B', order: 2 },
    { text: 'What is a 51% attack?', optionA: 'When 51% of users sell Bitcoin', optionB: 'When an entity controls majority of mining power', optionC: 'When 51% of nodes go offline', optionD: 'When fees exceed 51% of the block reward', correctOption: 'B', order: 3 },
    { text: 'What type of cryptography secures Bitcoin addresses?', optionA: 'Symmetric encryption', optionB: 'RSA', optionC: 'Elliptic Curve (secp256k1)', optionD: 'AES-256', correctOption: 'C', order: 4 },
    { text: 'What is a cold wallet?', optionA: 'A wallet with no funds', optionB: 'A wallet stored offline for security', optionC: 'A wallet on a cold server', optionD: 'A wallet in a cold country', correctOption: 'B', order: 5 },
  ]) {
    await prisma.question.create({ data: { quizId: quiz3.id, ...q } })
  }

  // ─── QUIZ 4: Bitcoin History (DRAFT — for demo of draft state) ───
  const quiz4 = await prisma.quiz.create({
    data: {
      title: 'Bitcoin History',
      description: 'From the whitepaper to El Salvador — how much do you know?',
      accessCode: 'KB-HIS04',
      rewardSats: 1000,
      setterFeePaid: true,
      status: 'draft',
    },
  })

  for (const q of [
    { text: 'When was the Bitcoin whitepaper published?', optionA: '2007', optionB: '2008', optionC: '2009', optionD: '2010', correctOption: 'B', order: 1 },
    { text: 'What was the first real-world Bitcoin purchase?', optionA: 'A car', optionB: 'A house', optionC: 'Two pizzas for 10,000 BTC', optionD: 'A domain name', correctOption: 'C', order: 2 },
    { text: 'Which country first made Bitcoin legal tender?', optionA: 'USA', optionB: 'Japan', optionC: 'El Salvador', optionD: 'Switzerland', correctOption: 'C', order: 3 },
    { text: 'What is the Genesis Block?', optionA: 'The most expensive block', optionB: 'The first block in the Bitcoin blockchain', optionC: 'A hardware wallet', optionD: 'The block with the most transactions', correctOption: 'B', order: 4 },
  ]) {
    await prisma.question.create({ data: { quizId: quiz4.id, ...q } })
  }

  console.log('')
  console.log('✅ Live database seeded for demo!')
  console.log('')
  console.log('┌──────────────────────────────────────────────────────────────┐')
  console.log('│  ACTIVE QUIZZES (ready to play)                             │')
  console.log('├──────────────────────────────────────────────────────────────┤')
  console.log(`│  1. Bitcoin Basics        Code: KB-BTC01   5 Q   500 sats   │`)
  console.log(`│  2. Lightning Network     Code: KB-LN002   5 Q   500 sats   │`)
  console.log(`│  3. Blockchain Security   Code: KB-SEC03   5 Q   500 sats   │`)
  console.log('├──────────────────────────────────────────────────────────────┤')
  console.log('│  DRAFT (for demo of quiz creation flow)                     │')
  console.log('├──────────────────────────────────────────────────────────────┤')
  console.log(`│  4. Bitcoin History        Code: KB-HIS04   4 Q   1000 sats │`)
  console.log('└──────────────────────────────────────────────────────────────┘')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
