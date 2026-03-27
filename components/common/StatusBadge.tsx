import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'text-xs font-medium px-2.5 py-1 rounded-full',
        status === 'active' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        status === 'ended' && 'bg-red-500/15 text-red-400 border border-red-500/30',
        status === 'draft' && 'bg-[--surface-2] text-[--muted] border border-[--border]'
      )}
    >
      {status === 'active' && '● '}{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
