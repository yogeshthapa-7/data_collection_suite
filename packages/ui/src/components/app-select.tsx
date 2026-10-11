import type { SelectProps } from 'antd'
import { Select as AntSelect } from 'antd'

export interface AppSelectProps extends Omit<SelectProps, 'variant'> {
  label?: string
  error?: string
  tone?: 'light' | 'dark'
}

export default function AppSelect({
  label,
  error,
  tone = 'light',
  className = '',
  ...rest
}: AppSelectProps) {
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
      <AntSelect
        className={`w-full ${className}`}
        status={error ? 'error' : undefined}
        {...rest}
      />
      {error && (
        <p className={`mt-1 text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      )}
    </div>
  )
}
