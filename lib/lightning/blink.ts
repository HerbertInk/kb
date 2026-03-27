// Real Lightning payout via Blink API (https://dev.blink.sv)
// Requires: BLINK_API_KEY and BLINK_WALLET_ID env vars
// Free to use for demo — sign up at https://dashboard.blink.sv

export async function sendPayment(
  lightningAddress: string,
  amountSats: number,
  memo: string
): Promise<{ success: boolean; paymentHash: string }> {
  const apiKey = process.env.BLINK_API_KEY
  const walletId = process.env.BLINK_WALLET_ID

  if (!apiKey || !walletId) {
    throw new Error('Blink env vars not set (BLINK_API_KEY, BLINK_WALLET_ID)')
  }

  const apiUrl = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql'

  // Use LnAddressPaymentSend to pay directly to a Lightning Address
  const mutation = `
    mutation LnAddressPaymentSend($input: LnAddressPaymentSendInput!) {
      lnAddressPaymentSend(input: $input) {
        status
        errors {
          message
          code
        }
        transaction {
          settlementVia {
            ... on SettlementViaLn {
              preImage
            }
          }
        }
      }
    }
  `

  const variables = {
    input: {
      walletId,
      amount: amountSats,
      lnAddress: lightningAddress,
      memo: memo || 'KB Quiz Reward',
    },
  }

  console.log('═══════════ BLINK LIGHTNING PAYOUT ═══════════')
  console.log(`→ Recipient : ${lightningAddress}`)
  console.log(`→ Amount    : ${amountSats} sats`)
  console.log(`→ Memo      : ${memo}`)
  console.log(`→ API       : ${apiUrl}`)

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({ query: mutation, variables }),
  })

  const data = await res.json()
  const result = data?.data?.lnAddressPaymentSend

  if (!result) {
    console.log('→ Status    : ✗ FAILED (no response)')
    throw new Error('Blink API returned no result')
  }

  if (result.errors && result.errors.length > 0) {
    const errMsg = result.errors.map((e: { message: string }) => e.message).join(', ')
    console.log(`→ Status    : ✗ FAILED (${errMsg})`)
    throw new Error(`Blink error: ${errMsg}`)
  }

  const paymentHash = result.transaction?.settlementVia?.preImage || `blink_${Date.now()}`

  console.log('→ Status    : ✓ PAID')
  console.log(`→ Hash      : ${paymentHash}`)
  console.log('═════════════════════════════════════════════')

  return {
    success: true,
    paymentHash,
  }
}
