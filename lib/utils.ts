import { randomBytes } from 'crypto'

export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KB-'
  for (let i = 0; i < 5; i++) {
    code += chars[randomBytes(1)[0] % chars.length]
  }
  return code
}

export function formatSats(sats: number): string {
  return sats.toLocaleString() + ' sats'
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
