import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import AuthLayout from '@/auth/AuthLayout'
import LoginPage from '@/auth/LoginPage'
import ModulePage from '@/module/ModulePage'
import RequireAuth from '@/auth/RequireAuth'
import PageLayout from '@/shared/components/layout/PageLayout'
import CategoryPage from '@/features/setup-pages/category/Category'
import CategoryGroupPage from '@/features/setup-pages/category-group/category_group'
import OrganizationPage from '@/features/setup-pages/organization/Organization'
import UsersPage from '@/features/setup-pages/users/Users'
import EmployeeInfoPage from '@/features/setup-pages/employee/EmployeeInfo'
import DepartmentPage from '@/features/setup-pages/departments/Department'
import MapboxResourceInfoPage from '@/features/setup-pages/mapbox-resource/MapboxResourceInfo'
import UploadDataSetPage from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/UploadDataSet'
import BranchPage from '@/features/setup-pages/branch/Branch'
import MainBranchPage from '@/features/setup-pages/main-branch/MainBranch'
import FormDataTablePage from '@/features/form-data/FormData'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import QuestionsTab from './features/questions/QuestionsTab'
import DeploymentPage from '@/features/deployment/Deployment'
import RankingCriteriasPage from '@/features/ranking-criteria/RankingCriterias'
// import RankingsPage from '@/features/ranking/Rankings'
import PhotoGalleryPage from '@/features/photo-gallary/PhotoGallery'
import CategoryLayout from './features/category-detail/CategoryLayout'

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
            <Route path="/mapbox-resource/upload-dataset" element={<UploadDataSetPage />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/main-branch" element={<MainBranchPage />} />
            <Route path="/form-data" element={<FormDataTablePage />} />
            <Route path="/category/:categoryId" element={<CategoryLayout />}>
              <Route index element={<Navigate to="questions" replace />} />
              <Route path="questions" element={<QuestionsTab />} />
              <Route path="deployment" element={<DeploymentPage />} />
              <Route path="ranking-criteria" element={<RankingCriteriasPage />} />
              {/* <Route path="ranking" element={<RankingsPage />} /> */}
              <Route path="photo-gallary" element={<PhotoGalleryPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
    </Provider>
  )
}

export default RootApp
