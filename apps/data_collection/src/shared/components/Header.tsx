import React from 'react'
import { Dropdown, Avatar } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getClientConfig } from '@/config/env'
import type { LoginDetail } from '@/config/env'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/auth/authSlice'
import { UserOutlined } from '@ant-design/icons'

const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const clientConfig = getClientConfig() as LoginDetail
  const userInfo = useAppSelector((state) => state.auth.userInfo)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login', { replace: true })
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'View Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  const logoUrl = clientConfig.logo
  const userName = userInfo?.UserName || 'User'

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 shadow-sm"
      style={{
        height: 72,
        minHeight: 72,
        lineHeight: 'normal',
      }}
    >
      <div className="flex h-full items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-11 w-11 object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[20px] font-bold leading-tight tracking-tight text-white">
            {clientConfig.mainHeading}
          </span>
        </div>
      </div>

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
        <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-indigo-500/20">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="bg-indigo-500/80 text-white"
          >
            {userName?.charAt(0)}
          </Avatar>

          <div className="hidden flex-col justify-center sm:flex">
            <span className="text-sm font-semibold leading-tight text-white">
              {userName}
            </span>
          </div>
        </div>
      </Dropdown>
    </header>
  )
}

export default AppHeader
