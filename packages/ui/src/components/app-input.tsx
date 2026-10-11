import type { InputProps } from 'antd'
import { Input as AntInput } from 'antd'

export interface AppInputProps extends Omit<InputProps, 'variant'> {
  label?: string
  error?: string
  hint?: string
  tone?: 'light' | 'dark'
}

export default function AppInput({
  label,
  error,
  hint,
  tone = 'light',
  className = '',
  ...rest
}: AppInputProps) {
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
      <AntInput
        className={[
          'h-10 rounded-lg',
          dark
            ? 'border-slate-600/70 bg-slate-900/60 text-slate-100 placeholder:text-slate-500'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
          className,
        ].join(' ')}
        status={error ? 'error' : undefined}
        {...rest}
      />
      {error ? (
        <p className={`mt-1 text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      ) : hint ? (
        <p className={`mt-1 text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{hint}</p>
      ) : null}
    </div>
  )
}
