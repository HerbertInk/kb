export async function sendPayment(
  lightningAddress: string,
  amountSats: number,
  memo: string
): Promise<{ success: boolean; paymentHash: string }> {
  console.log('═══════════ LIGHTNING DEMO PAYOUT ═══════════')
  console.log(`→ Recipient : ${lightningAddress}`)
  console.log(`→ Amount    : ${amountSats} sats`)
  console.log(`→ Memo      : ${memo}`)
  console.log('→ Status    : ✓ PAID (simulated)')
  console.log('═════════════════════════════════════════════')

  await new Promise((r) => setTimeout(r, 800))

  return {
    success: true,
    paymentHash: `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  }
}
