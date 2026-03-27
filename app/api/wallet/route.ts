import { NextResponse } from 'next/server'
import { lightningMode } from '@/lib/lightning'

export async function GET() {
  // If in demo mode, return mock wallet data
  if (lightningMode !== 'blink') {
    return NextResponse.json({
      mode: 'demo',
      connected: true,
      balance: 100000,
      walletId: 'demo-wallet',
      currency: 'BTC',
    })
  }

  const apiKey = process.env.BLINK_API_KEY
  const walletId = process.env.BLINK_WALLET_ID
  const apiUrl = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql'

  if (!apiKey || !walletId || apiKey === 'your_blink_api_key') {
    return NextResponse.json({
      mode: 'blink',
      connected: false,
      error: 'Blink API key not configured',
    })
  }

  try {
    // Query wallet balance via Blink GraphQL API
    const query = `
      query Me {
        me {
          defaultAccount {
            wallets {
              id
              walletCurrency
              balance
            }
          }
        }
      }
    `

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ query }),
    })

    const data = await res.json()
    const wallets = data?.data?.me?.defaultAccount?.wallets || []

    // Find the BTC wallet
    const btcWallet = wallets.find(
      (w: { walletCurrency: string }) => w.walletCurrency === 'BTC'
    )

    if (!btcWallet) {
      return NextResponse.json({
        mode: 'blink',
        connected: true,
        error: 'No BTC wallet found',
        wallets,
      })
    }

    return NextResponse.json({
      mode: 'blink',
      connected: true,
      balance: btcWallet.balance,
      walletId: btcWallet.id,
      currency: 'BTC',
    })
  } catch (err: unknown) {
    return NextResponse.json({
      mode: 'blink',
      connected: false,
      error: err instanceof Error ? err.message : 'Failed to connect to Blink',
    })
  }
}
