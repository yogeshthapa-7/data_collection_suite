import type { DatePickerProps } from 'antd'
import { DatePicker as AntDatePicker } from 'antd'

export interface AppDatePickerProps extends DatePickerProps {
  label?: string
  tone?: 'light' | 'dark'
}

export default function AppDatePicker({
  label,
  tone = 'light',
  className = '',
  ...rest
}: AppDatePickerProps) {
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
      <AntDatePicker
        className={`w-full rounded-lg ${className}`}
        format="YYYY-MM-DD"
        {...rest}
      />
    </div>
  )
}
