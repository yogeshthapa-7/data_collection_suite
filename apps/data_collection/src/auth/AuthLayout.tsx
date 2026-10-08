import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Outlet />
    </div>
  )
}

export default AuthLayout
