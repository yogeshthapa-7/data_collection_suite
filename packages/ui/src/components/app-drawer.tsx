import { useEffect, useRef, useState } from 'react'
import type { TransitionEvent } from 'react'
import { createPortal } from 'react-dom'
import { CloseOutlined } from '@ant-design/icons'

export interface AppDrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  width?: number
  zIndex?: number
}

export default function AppDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 480,
  zIndex = 9999,
}: AppDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const onCloseRef = useRef(onClose)
  const bodyOverflowRef = useRef('')
  const bodyPaddingRightRef = useRef('')
  const bodyLockedRef = useRef(false)
  onCloseRef.current = onClose

  const unlockBody = () => {
    if (!bodyLockedRef.current) return
    requestAnimationFrame(() => {
      document.body.style.overflow = bodyOverflowRef.current
      document.body.style.paddingRight = bodyPaddingRightRef.current
      bodyLockedRef.current = false
    })
  }

  const close = () => onCloseRef.current()

  useEffect(() => {
    if (open) {
      setMounted(true)
      setVisible(false)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setVisible(true)
        })
      })

      const updateBodyStyles = () => {
        bodyOverflowRef.current = document.body.style.overflow
        bodyPaddingRightRef.current = document.body.style.paddingRight
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`
        }
        document.body.style.overflow = 'hidden'
        bodyLockedRef.current = true
      }

      requestAnimationFrame(updateBodyStyles)
    } else if (mounted) {
      setVisible(false)
      timeoutRef.current = window.setTimeout(() => {
        setMounted(false)
        unlockBody()
      }, 320)
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      unlockBody()
    }
  }, [open])

  useEffect(() => {
    return () => {
      unlockBody()
    }
  }, [])

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform' && !visible) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setMounted(false)
      unlockBody()
    }
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 flex" style={{ zIndex }} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      <div
        className={`relative flex h-full flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background:
            'radial-gradient(120% 90% at 100% 0%, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0) 55%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          boxShadow: '0 25px 50px -12px rgba(2, 6, 23, 0.45)',
          borderLeft: '1px solid rgba(148, 163, 184, 0.25)',
          width: '100%',
          maxWidth: width,
          marginLeft: 'auto',
          transform: visible ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {(title || subtitle) && (
          <div className="relative flex shrink-0 items-start justify-between border-b border-slate-200/80 bg-white/60 px-4 py-4 sm:px-7 sm:pt-7 sm:pb-5">
            <div>
              {title && (
                <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
              )}
              {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={close}
              className="cursor-pointer rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>
        )}

        <div
          className="drawer-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
