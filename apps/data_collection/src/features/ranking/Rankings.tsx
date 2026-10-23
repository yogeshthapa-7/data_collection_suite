import { useState, useEffect } from 'react'
import { Row, Col, Spin, message, Typography, Modal } from 'antd'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { AppCard, AppDrawer, AppSelect, Button } from '@data-collection-suite/ui'
import { useOutletContext } from 'react-router-dom'
import type { CategoryWorkspaceContext } from '@/features/category-detail/types/categoryDetail'
import {
  fetchRankingCriterias,
  fetchRankingConditions,
  deleteRankingCondition,
} from '@/features/ranking/services/ranking.service'
import type { RankingCondition, RankingCriteriaSelectItem } from '@/features/ranking/types/ranking'
import RankingForm from './RankingForm'

const Rankings = () => {
  const { categoryId } = useOutletContext<CategoryWorkspaceContext>()
  const [criteriaOptions, setCriteriaOptions] = useState<RankingCriteriaSelectItem[]>([])
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<number | undefined>()
  const [data, setData] = useState<RankingCondition[]>([])
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingCondition, setEditingCondition] = useState<RankingCondition | null>(null)

  useEffect(() => {
    if (!categoryId) return
    fetchRankingCriterias(categoryId).then(setCriteriaOptions).catch(() => message.error('Failed to load criteria'))
  }, [categoryId])

  const loadData = async () => {
    if (!selectedCriteriaId || !categoryId) return
    setLoading(true)
    try {
      const res = await fetchRankingConditions(categoryId, selectedCriteriaId)
      setData(res)
    } catch {
      message.error('Failed to load conditions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [selectedCriteriaId])

  const handleDelete = (condition: RankingCondition) => {
    Modal.confirm({
      title: 'Delete Ranking Condition',
      content: `Are you sure you want to delete "${condition.Group}"?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteRankingCondition(condition.RankingConditionID)
          message.success('Deleted successfully')
          loadData()
        } catch {
          message.error('Failed to delete')
        }
      },
    })
  }

  return (
    <div className="p-6">
      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-64">
              <label className="mb-1 block text-sm font-bold text-black">Ranking Criteria</label>
              <AppSelect
                placeholder="Select ranking criteria"
                options={criteriaOptions.map((c) => ({ value: c.RankingCriteriaID, label: c.CriteriaName }))}
                value={selectedCriteriaId}
                onChange={(val) => setSelectedCriteriaId(val as number)}
                className="w-full"
                showSearch
                allowClear
              />
            </div>
            <Button type="primary" icon={<PlusOutlined />} className="ml-auto" onClick={() => { setEditingCondition(null); setDrawerOpen(true) }}>
              Add Ranking Condition
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {data.map((condition) => (
            <Col xs={24} sm={12} md={12} lg={8} key={condition.RankingConditionID}>
              <AppCard className="h-full" hover>
                <div className="mb-4 flex items-start justify-between">
                  <Typography.Title level={5} className="!mb-0 !font-semibold !text-gray-800">
                    {condition.Group}
                  </Typography.Title>
                  <div className="flex gap-1">
                    <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setEditingCondition(condition); setDrawerOpen(true) }} />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(condition)} />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <Typography.Text type="secondary" className="shrink-0">Expression</Typography.Text>
                    <div className="font-medium text-gray-700">{condition.Expression}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Typography.Text type="secondary" className="shrink-0">Operator</Typography.Text>
                    <div className="font-medium text-gray-700">{condition.Operator}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Typography.Text type="secondary" className="shrink-0">Match Marks</Typography.Text>
                    <div className="font-medium text-gray-700">{condition.MatchMarks}</div>
                  </div>
                </div>
              </AppCard>
            </Col>
          ))}
        </Row>

        {!loading && selectedCriteriaId && data.length === 0 && <div className="py-12 text-center text-slate-400">No ranking conditions found</div>}

        <AppDrawer
          open={drawerOpen}
          onClose={() => { setDrawerOpen(false); setEditingCondition(null) }}
          title={editingCondition ? 'Edit Ranking Condition' : 'Add Ranking Condition'}
          width={800}
        >
          <RankingForm
            editingCondition={editingCondition}
            onCancel={() => setDrawerOpen(false)}
            onSuccess={() => { setEditingCondition(null); setDrawerOpen(false); loadData() }}
          />
        </AppDrawer>
      </Spin>
    </div>
  )
}

export default Rankings