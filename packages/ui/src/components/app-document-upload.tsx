import { useCallback, useEffect, useRef, useState } from 'react'
import { DeleteOutlined, FileTextOutlined, InboxOutlined } from '@ant-design/icons'

export interface AppDocumentUploadProps {
  value?: string
  onChange?: (path: string) => void
  onUpload: (file: File) => Promise<string>
  uploading?: boolean
  onUploadingChange?: (uploading: boolean) => void
  disabled?: boolean
  accept?: string
  label?: string
  hint?: string
}

const FILE_TYPE_CONFIGS = [
  { extension: ['pdf'], color: 'text-red-600', bgColor: 'bg-red-50', label: 'PDF' },
  { extension: ['doc', 'docx'], color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Word' },
  { extension: ['xls', 'xlsx', 'csv'], color: 'text-green-600', bgColor: 'bg-green-50', label: 'Excel' },
  { extension: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'], color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Image' },
]

const DEFAULT_FILE_TYPE = { extension: [] as string[], color: 'text-slate-600', bgColor: 'bg-slate-50', label: 'File' }

export default function AppDocumentUpload({
  value,
  onChange,
  onUpload,
  uploading = false,
  onUploadingChange,
  disabled = false,
  accept = 'application/pdf',
  label,
  hint,
}: AppDocumentUploadProps) {
  const [fileName, setFileName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  useEffect(() => {
    if (value && !fileName) {
      const nameFromUrl = value.split('/').pop()
      if (nameFromUrl) setFileName(nameFromUrl)
    }
  }, [value, fileName])

  const uploadFile = useCallback(
    async (file: File) => {
      setFileName(file.name)
      setUploadError('')
      try {
        onUploadingChange?.(true)
        const path = await onUpload(file)
        onChange?.(path)
      } catch (err) {
        setFileName('')
        onChange?.('')
        setUploadError(err instanceof Error ? err.message : 'Failed to upload document')
      } finally {
        onUploadingChange?.(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [onUpload, onChange, onUploadingChange]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      dragCounterRef.current = 0
      setIsDragOver(false)
      if (disabled || uploading) return
      const file = e.dataTransfer.files?.[0]
      if (file) await uploadFile(file)
    },
    [disabled, uploading, uploadFile]
  )

  const handleRemove = () => {
    setFileName('')
    setUploadError('')
    onChange?.('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const config = fileName
    ? FILE_TYPE_CONFIGS.find((c) => c.extension.includes(fileName.split('.').pop()?.toLowerCase() || '')) ?? DEFAULT_FILE_TYPE
    : null

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}

      {fileName ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${config?.bgColor}`}>
              <FileTextOutlined className={config?.color} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-slate-800">{fileName}</div>
              {hint && <div className="text-xs text-slate-500">{hint}</div>}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:opacity-50"
          >
            <DeleteOutlined />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); dragCounterRef.current += 1; setIsDragOver(true) }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => { dragCounterRef.current -= 1; if (dragCounterRef.current <= 0) setIsDragOver(false) }}
          onDrop={handleDrop}
          disabled={disabled || uploading}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isDragOver ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
          }`}
        >
          <InboxOutlined className="text-lg text-slate-400" />
          <span className="font-medium">
            {uploading ? 'Uploading...' : isDragOver ? 'Drop file here' : 'Click to upload document'}
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadFile(f) }}
        disabled={disabled || uploading}
        className="hidden"
      />

      {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
    </div>
  )
}