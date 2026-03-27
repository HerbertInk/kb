// Real Lightning payout via Blink API (https://dev.blink.sv)
// Requires: BLINK_API_KEY and BLINK_WALLET_ID env vars
// Free to use — sign up at https://dashboard.blink.sv

export async function sendPayment(
  lightningAddress: string,
  amountSats: number,
  memo: string,
  overrideWalletId?: string | null
): Promise<{ success: boolean; paymentHash: string }> {
  const apiKey = process.env.BLINK_API_KEY
  const defaultWalletId = process.env.BLINK_WALLET_ID
  const walletId = overrideWalletId || defaultWalletId

  if (!apiKey) {
    throw new Error('BLINK_API_KEY not set')
  }
  if (!walletId) {
    throw new Error('No wallet ID configured (set BLINK_WALLET_ID or add one when creating the quiz)')
  }

  const apiUrl = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql'

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
    },
  }

  console.log('═══════════ BLINK LIGHTNING PAYOUT ═══════════')
  console.log(`→ Recipient : ${lightningAddress}`)
  console.log(`→ Amount    : ${amountSats} sats`)
  console.log(`→ Wallet    : ${walletId}${overrideWalletId ? ' (custom)' : ' (default)'}`)
  console.log(`→ Memo      : ${memo}`)

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
    const gqlErrors = data?.errors
    const errMsg = gqlErrors?.length
      ? gqlErrors.map((e: { message: string }) => e.message).join(', ')
      : 'Blink API returned no result'
    console.log(`→ Status    : ✗ FAILED (${errMsg})`)
    throw new Error(errMsg)
  }

  if (result.errors && result.errors.length > 0) {
    const errMsg = result.errors.map((e: { message: string }) => e.message).join(', ')
    console.log(`→ Status    : ✗ FAILED (${errMsg})`)
    throw new Error(`Blink: ${errMsg}`)
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
