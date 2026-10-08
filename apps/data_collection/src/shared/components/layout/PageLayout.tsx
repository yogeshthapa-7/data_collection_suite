import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import GovernmentBackground from './GovernmentBackground'
import Header from '@/shared/components/Header'
import NavigationMenu from '@/shared/components/NavigationMenu'

interface PageLayoutProps {
  children?: ReactNode
  showBackground?: boolean
  showNavigation?: boolean
  showHeader?: boolean
}

const PageLayout = ({ children, showBackground = true, showNavigation = true, showHeader = true }: PageLayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {showBackground && <GovernmentBackground />}
      {showHeader && <Header />}
      {showNavigation && <NavigationMenu />}
      <main className="relative z-10 p-8">
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default PageLayout
