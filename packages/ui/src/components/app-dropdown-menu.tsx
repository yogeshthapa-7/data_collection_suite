import type { ReactNode } from 'react'
import { Dropdown as AntDropdown } from 'antd'
import type { MenuProps } from 'antd'

export interface AppDropdownMenuItem {
  label?: string
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  divider?: boolean
}

export interface AppDropdownMenuProps {
  trigger: ReactNode
  items: AppDropdownMenuItem[]
  className?: string
  placement?: 'bottomRight' | 'bottomLeft' | 'bottom' | 'topRight' | 'topLeft'
}

export default function AppDropdownMenu({
  trigger,
  items,
  className,
  placement = 'bottomRight',
}: AppDropdownMenuProps) {
  const menuItems: NonNullable<MenuProps['items']> = items.map((item, index) => {
    if (item.divider) return { type: 'divider' as const, key: `divider-${index}` }
    return {
      key: String(index),
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
      danger: item.danger,
    }
  })

  return (
    <AntDropdown
      menu={{ items: menuItems }}
      placement={placement}
      className={className}
      trigger={['click']}
      getPopupContainer={() => document.body}
    >
      {trigger}
    </AntDropdown>
  )
}
