import React from 'react'
import { useOutletContext } from 'react-router-dom'
import type { CategoryWorkspaceContext } from '@/features/category-detail/types/CategoryDetail'

const QuestionsTab: React.FC = () => {
  // You can access categoryId or categoryInfo passed from CategoryLayout whenever you need it:
  const { categoryId, categoryInfo } = useOutletContext<CategoryWorkspaceContext>()

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold text-slate-800">Question Page</h2>
      {/* Category ID: {categoryId} */}
    </div>
  )
}

export default QuestionsTab
