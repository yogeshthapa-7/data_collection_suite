import type { ReactNode } from 'react'
import { Input } from 'antd'

export interface AppSearchInputProps {
  value: string
  onChange: (value: string) => void
  onPressEnter?: () => void
  placeholder?: string
  icon?: ReactNode
  className?: string
  containerClassName?: string
}

export default function AppSearchInput({
  value,
  onChange,
  onPressEnter,
  placeholder = 'Search...',
  icon,
  className = '',
  containerClassName = '',
}: AppSearchInputProps) {
  return (
    <div className={containerClassName}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPressEnter={onPressEnter}
        prefix={icon}
        className={className}
        allowClear
      />
    </div>
  )
}