# KB — Knowledge Byte: Presentation / Slide Deck Guide

Use this document to create a presentation about the **Knowledge Byte (KB)** project.

---

## Slide 1: Title

- **Title:** Knowledge Byte (KB)
- **Subtitle:** Quiz Competitions Powered by Bitcoin Lightning
- **Tagline:** "Win Bitcoin. Prove You Know."

---

## Slide 2: The Problem

- Traditional quizzes lack real incentives for students
- No instant reward mechanism for academic performance
- Existing quiz platforms (Kahoot, etc.) don't integrate Bitcoin payments
- No easy way to reward knowledge with real money instantly

---

## Slide 3: The Solution — KB

- A web-based quiz competition platform
- Institutions/teachers create MCQ quizzes with a Bitcoin reward (in satoshis)
- Students join via a shareable link (like Kahoot) or access code
- Top scorer receives instant payment via **Bitcoin Lightning Network**
- Real-time leaderboard tracks progress live

---

## Slide 4: How It Works

**For the Quiz Setter (Teacher/Institution):**
1. Create a quiz — set title, description, reward amount (sats)
2. Add multiple-choice questions (A/B/C/D) with correct answers
3. Activate the quiz — generates access code + shareable link
4. Share the link with students
5. Monitor live leaderboard as students compete
6. End the quiz — Lightning payout fires automatically to the winner

**For Students:**
1. Click the shared link (or enter access code)
2. Enter name + Lightning wallet address
3. Answer questions one at a time
4. See score in real-time
5. View leaderboard after completion
6. Winner receives Bitcoin instantly

---

## Slide 5: Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion animations |
| Database | Prisma ORM + SQLite (LibSQL adapter) |
| Payments | Bitcoin Lightning Network (LND REST API) |
| Lightning Modes | Demo (simulated) or Polar (real local node) |

---

## Slide 6: Key Features

- **Kahoot-style sharing** — Students join via direct link, no app install needed
- **Real-time leaderboard** — Live polling every 3 seconds
- **Lightning Network payouts** — Instant, near-zero fee Bitcoin payments
- **Full quiz management** — Create, edit, delete quizzes and questions
- **Mobile-first design** — Works beautifully on phones and desktops
- **Dual Lightning modes** — Demo mode for testing, Polar for real payments
- **Access code + direct link** — Two ways to share quizzes

---

## Slide 7: Lightning Network Integration

- Uses **LNURL-pay** protocol for payments
- Students provide a **Lightning Address** (e.g., `user@walletofsatoshi.com`)
- When the quiz ends, the system:
  1. Determines the winner (highest score, fastest completion)
  2. Fetches a Lightning invoice from the winner's wallet
  3. Pays the invoice via LND REST API
  4. Confirms payment with a payment hash
- Supported wallets: Wallet of Satoshi, Zeus, Blink, Alby, Strike, etc.

---

## Slide 8: Application Architecture

```
┌─────────────────────────────────────────┐
│              Next.js Frontend            │
│  (Landing, Setter Portal, Quiz UI)      │
├─────────────────────────────────────────┤
│           Next.js API Routes             │
│  (Quiz CRUD, Join, Answer, Leaderboard) │
├─────────────────────────────────────────┤
│         Prisma ORM + SQLite DB           │
│  (Quiz, Question, Participant, Answer)   │
├─────────────────────────────────────────┤
│        Lightning Payment Module          │
│  (Demo mock  |  Polar LND real node)     │
└─────────────────────────────────────────┘
```

---

## Slide 9: Database Schema

- **Quiz** — title, description, accessCode, rewardSats, status (draft/active/ended)
- **Question** — text, 4 options (A/B/C/D), correctOption, order
- **Participant** — name, lightningAddress, score, progress
- **Answer** — selectedOption, isCorrect, timestamp

Relationships: Quiz → Questions, Quiz → Participants, Participant → Answers

---

## Slide 10: User Flows (with screenshots)

### Setter Flow:
1. Dashboard showing all quizzes with status
2. Create new quiz form
3. Add questions page (two-column: form + list)
4. Manage page with share link, controls, live leaderboard

### Student Flow:
1. Join page — enter name + wallet
2. Quiz interface — one question at a time with progress bar
3. Results page with score
4. Leaderboard with medals and rankings

---

## Slide 11: Switching to Real Lightning Payments

1. Install **Polar** (Lightning Network simulator) → create a network → start nodes
2. Copy the admin macaroon hex from Polar
3. Update environment variables:
   ```
   NEXT_PUBLIC_LN_MODE=polar
   POLAR_LND_REST_URL=http://localhost:8080
   POLAR_MACAROON_HEX=<your_hex>
   ```
4. Restart the server — all payments become real Lightning transactions

---

## Slide 12: Key Architecture Decisions

| Decision | Why |
|---|---|
| SQLite for database | Zero config, file-based, perfect for demo/MVP |
| Polling every 3s for leaderboard | Simple, no WebSocket complexity for MVP |
| SessionStorage for participants | No auth needed, keeps it simple |
| Lightning mode via env var | Clean separation, zero coupling |
| One question at a time | Prevents answer-peeking, fair play |
| Shareable direct links | Kahoot-style UX, lowest friction to join |

---

## Slide 13: Future Enhancements

- User authentication for quiz setters
- Timer per question (countdown)
- Multiple payment currencies
- Team-based quizzes
- Analytics dashboard for setters
- QR code for joining quizzes
- WebSocket for truly real-time leaderboard
- Production database (PostgreSQL)

---

## Slide 14: Demo

- **Live demo URL:** `http://localhost:3000`
- Show creating a quiz, adding questions, activating
- Open the share link on a phone to join
- Answer questions and watch the leaderboard update live
- End the quiz and see the Lightning payout

---

## Slide 15: Conclusion

- KB bridges education and Bitcoin incentives
- Lightning Network enables instant, low-cost micropayments
- Students are motivated by real rewards
- Fully functional MVP with clean architecture
- Easy to extend to production

**"Learn. Compete. Earn Bitcoin."**

---

## Project Setup (for anyone running it)

```bash
cd kb
yarn install
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts   # seed sample data
yarn dev                  # http://localhost:3000
```

Active quiz codes for testing: `KB-BTC01`, `KB-LN002`
