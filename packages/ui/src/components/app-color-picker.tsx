import type { ComponentProps } from 'react'
import { ColorPicker as AntColorPicker } from 'antd'

export interface AppColorPickerProps extends Omit<ComponentProps<typeof AntColorPicker>, 'variant'> {
  label?: string
  tone?: 'light' | 'dark'
}

export default function AppColorPicker({
  label,
  tone = 'light',
  className = '',
  ...rest
}: AppColorPickerProps) {
  const dark = tone === 'dark'

  return (
    <div className="w-full">
      {label && (
        <label
          className={`mb-1.5 block text-sm font-medium ${
            dark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {label}
        </label>
      )}
      <AntColorPicker className={className} {...rest} />
    </div>
  )
}