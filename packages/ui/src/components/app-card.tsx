import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { Card as AntCard } from 'antd'

export interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: string
}

const BASE_SHADOW = '0 1px 3px rgba(15,23,42,0.08), 0 8px 24px rgba(15,23,42,0.10)'
const HOVER_SHADOW = '0 12px 34px rgba(79,70,229,0.18), 0 4px 12px rgba(15,23,42,0.10)'

export default function AppCard({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...rest
}: AppCardProps) {
  const bodyStyle: CSSProperties =
    padding === 'p-6' ? { padding: 16, overflow: 'visible' } : { overflow: 'visible' }

  return (
    <AntCard
      className={className}
      styles={{ body: bodyStyle }}
      style={{
        background: '#f8fafc',
        boxShadow: '0 1px 3px rgba(124,58,237,0.04), 0 8px 24px rgba(124,58,237,0.06)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)',
        ...(hover ? { cursor: 'pointer' } : {}),
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = HOVER_SHADOW
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = BASE_SHADOW
        }
      }}
      {...rest}
    >
      {children}
    </AntCard>
  )
}