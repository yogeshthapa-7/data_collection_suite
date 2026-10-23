import { useEffect, useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Spin, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { fetchCategoryById } from './services/categoryDetail.service'
import type { CategoryItem } from '@/features/setup-pages/category/types/category'
import type { CategoryWorkspaceContext, TabItem } from './types/categoryDetail'

const WORKSPACE_TABS: TabItem[] = [
  { key: 'questions', label: 'Questions' },
  { key: 'deployment', label: 'Deployment' },
  { key: 'subform', label: 'SubForm' },
  { key: 'response', label: 'Response' },
  { key: 'photo-gallary', label: 'Photo Gallery' },
  { key: 'visualization', label: 'Visualization' },
  { key: 'dynamic-report', label: 'Dynamic Report' },
  { key: 'ranking-criteria', label: 'Ranking Criteria' },
  // { key: 'ranking', label: 'Ranking' },
  { key: 'group-view', label: 'Group View' },
  { key: 'map-view', label: 'Map View' },
  { key: 'stages', label: 'Stages' },
]

export const CategoryLayout = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const parsedCategoryId = Number(categoryId)
  const location = useLocation()
  const navigate = useNavigate()

  const [categoryInfo, setCategoryInfo] = useState<CategoryItem | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine active tab from URL path (e.g. /category/12/deployment -> "deployment")
  const activeTab = useMemo(() => {
    const segments = location.pathname.split('/')
    return segments[segments.length - 1] || 'questions'
  }, [location.pathname])

  const loadCategory = async () => {
    if (!parsedCategoryId) return
    setLoading(true)
    const data = await fetchCategoryById(parsedCategoryId)
    setCategoryInfo(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCategory()
  }, [parsedCategoryId])

  const handleTabClick = (tabKey: string) => {
    navigate(`/category/${parsedCategoryId}/${tabKey}`)
  }

  const contextValue: CategoryWorkspaceContext = {
    categoryId: parsedCategoryId,
    categoryInfo,
    loading,
    refetchCategory: loadCategory,
  }

  return (
    <div className="space-y-4">
      {/* 1. Top Header Banner: Category Name, Code, and Group */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/category')}
            className="border-slate-300"
          >
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              {loading ? (
                'Loading Category...'
              ) : (
                <>
                  {categoryInfo?.CategoryName || 'Category Details'}
                  {categoryInfo?.CategoryCode && (
                    <span className="text-slate-500 font-normal"> ({categoryInfo.CategoryCode})</span>
                  )}
                  {categoryInfo?.CategoryGroupName && (
                    <span className="text-slate-400 font-normal"> / {categoryInfo.CategoryGroupName}</span>
                  )}
                </>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Main Card containing Tabs & Nested Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2 mb-4 overflow-x-auto">
          {WORKSPACE_TABS.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabClick(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 3. Dynamic Nested Page Content Swapped Here */}
        <Spin spinning={loading}>
          <div className="min-h-[400px]">
            <Outlet context={contextValue} />
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default CategoryLayout
