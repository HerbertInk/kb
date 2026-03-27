interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const widths = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
}

export function PageContainer({ children, className = '', maxWidth = 'lg' }: PageContainerProps) {
  return (
    <div className={`${widths[maxWidth]} mx-auto px-4 sm:px-6 py-10 sm:py-16 ${className}`}>
      {children}
    </div>
  )
}
