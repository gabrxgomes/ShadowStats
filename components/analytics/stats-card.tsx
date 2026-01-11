import { Card } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: ReactNode
  subtitle?: string
}

export function StatsCard({ title, value, change, icon, subtitle }: StatsCardProps): JSX.Element {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <Card className="p-6" hover>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-text-tertiary'
            }`}
          >
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </span>
          <span className="text-xs text-text-tertiary">vs last period</span>
        </div>
      )}
    </Card>
  )
}
