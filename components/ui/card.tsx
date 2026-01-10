import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'highlight'
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
}: CardProps): JSX.Element {
  const baseStyles = 'rounded-lg border transition-colors duration-200'

  const variantStyles = {
    default: 'bg-bg-secondary border-border',
    highlight: 'bg-gradient-solana-subtle border-primary-400/20',
  }

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const hoverStyles = hover ? 'hover:border-border-hover' : ''

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  )
}
