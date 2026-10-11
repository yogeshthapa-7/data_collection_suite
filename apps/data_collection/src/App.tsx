import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import AuthLayout from '@/auth/AuthLayout'
import LoginPage from '@/auth/LoginPage'
import ModulePage from '@/module/ModulePage'
import RequireAuth from '@/auth/RequireAuth'
import PageLayout from '@/shared/components/layout/PageLayout'
import CategoryPage from '@/features/pages/category/Category'
import CategoryGroupPage from '@/features/pages/category-group/category_group'
import OrganizationPage from '@/features/pages/organization/Organization'
import UsersPage from '@/features/pages/users/Users'
import EmployeeInfoPage from '@/features/pages/employee/EmployeeInfo'
import DepartmentPage from '@/features/pages/departments/Department'
import MapboxResourceInfoPage from '@/features/pages/mapbox-resource/MapboxResourceInfo'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

function RootApp() {
  return (
    <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 12,
          zIndexPopupBase: 10500,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Card: {
            borderRadiusLG: 16,
          },
          Button: {
            borderRadius: 10,
          },
          Input: {
            borderRadius: 10,
          },
          Select: {
            borderRadius: 10,
          },
          Modal: {
            borderRadiusLG: 16,
          },
        },
      }}
      modal={{
        style: { zIndex: 10001 },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route
              path="/auth/login/module"
              element={
                <RequireAuth>
                  <ModulePage />
                </RequireAuth>
              }
            />
          </Route>
          <Route element={<PageLayout />}>
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category-group" element={<CategoryGroupPage />} />
            <Route path="/organization-group" element={<OrganizationPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/employee" element={<EmployeeInfoPage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/mapbox-resource" element={<MapboxResourceInfoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
    </Provider>
  )
}

export default RootApp
