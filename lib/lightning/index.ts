import * as demo from './demo'
import * as blink from './blink'

const mode = process.env.NEXT_PUBLIC_LN_MODE ?? 'demo'

export const lightning = mode === 'blink' ? blink : demo

export { mode as lightningMode }
