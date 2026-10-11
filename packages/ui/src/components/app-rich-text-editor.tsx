import { useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export interface AppRichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  label?: string
  placeholder?: string
  className?: string
  readOnly?: boolean
}

const TOOLBAR = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link'],
  ['clean'],
]

export default function AppRichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Write something...',
  className = '',
  readOnly = false,
}: AppRichTextEditorProps) {
  const modules = useMemo(() => ({ toolbar: { container: TOOLBAR } }), [])

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
      <div className="rounded-lg [&_.ql-editor]:min-h-[120px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg">
        <ReactQuill
          theme="snow"
          value={value ?? ''}
          onChange={(content) => onChange?.(content)}
          modules={modules}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}
