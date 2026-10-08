import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  showTopbar?: boolean
}

const AppLayout = ({ children, showTopbar = true }: AppLayoutProps) => {
  return (
    <div className="min-h-screen">
      {showTopbar && (
        <header className="h-16 border-b border-[var(--border)] bg-white/80 backdrop-blur">
          {/* Topbar placeholder */}
        </header>
      )}
      <main>{children}</main>
    </div>
  )
}

export default AppLayout
