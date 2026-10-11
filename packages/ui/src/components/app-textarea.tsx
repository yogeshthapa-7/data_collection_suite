import type { TextAreaProps } from 'antd/es/input'
import { Input as AntInput } from 'antd'

export interface AppTextareaProps extends Omit<TextAreaProps, 'variant'> {
  label?: string
  error?: string
  tone?: 'light' | 'dark'
}

export default function AppTextarea({
  label,
  error,
  tone = 'light',
  className = '',
  ...rest
}: AppTextareaProps) {
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
      <AntInput.TextArea
        rows={3}
        className={[
          'rounded-lg',
          dark
            ? 'border-slate-600/70 bg-slate-900/60 text-slate-100 placeholder:text-slate-500'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && (
        <p className={`mt-1 text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      )}
    </div>
  )
}
