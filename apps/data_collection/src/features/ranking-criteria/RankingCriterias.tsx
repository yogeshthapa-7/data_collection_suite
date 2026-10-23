import { useState, useEffect } from 'react'
import { Row, Col, Spin, message, Typography, Modal } from 'antd'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { AppCard, AppDrawer, Button } from '@data-collection-suite/ui'
import { useOutletContext } from 'react-router-dom'
import type { CategoryWorkspaceContext } from '@/features/category-detail/types/categoryDetail'
import { fetchRankingCriteria, deleteRankingCriteria } from '@/features/ranking-criteria/services/ranking-criteria.service'
import type { RankingCriteria } from '@/features/ranking-criteria/types/ranking-criteria'
import RankingCriteriaForm from './RankingCriteriaForm'

const RankingCriterias = () => {
  const { categoryId } = useOutletContext<CategoryWorkspaceContext>()
  const [data, setData] = useState<RankingCriteria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingCriteria, setEditingCriteria] = useState<RankingCriteria | null>(null)

  const loadData = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      const res = await fetchRankingCriteria(categoryId)
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ranking criteria')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [categoryId])
  useEffect(() => { if (error) message.error(error) }, [error])

  const handleDelete = (criteria: RankingCriteria) => {
    Modal.confirm({
      title: 'Delete Ranking Criteria',
      content: `Are you sure you want to delete "${criteria.CriteriaName}"?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteRankingCriteria(criteria.RankingCriteriaID)
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
          <div className="flex items-end justify-between">
            <Typography.Title level={5} className="!mb-0">Ranking Criteria</Typography.Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCriteria(null); setDrawerOpen(true) }}>
              Add Ranking Criteria
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {data.map((criteria) => (
            <Col xs={24} sm={12} md={12} lg={8} key={criteria.RankingCriteriaID}>
  <AppCard className="h-full" hover>
    <div className="mb-4 flex items-start justify-between">
      <Typography.Title level={5} className="!mb-0 !font-semibold !text-gray-800">
        {criteria.CriteriaName}
      </Typography.Title>
    </div>

    <div className="border-b border-slate-200 my-3" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex gap-2">
        <Button
          size="small"
          style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
          icon={<EditOutlined />}
          onClick={() => {
            setEditingCriteria(criteria)
            setDrawerOpen(true)
          }}
        >
          Edit
        </Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(criteria)}>
          Delete
        </Button>
      </div>
    </div>
  </AppCard>
</Col>
          ))}
        </Row>

        {!loading && data.length === 0 && <div className="py-12 text-center text-slate-400">No ranking criteria found</div>}
      </Spin>

      <AppDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingCriteria(null) }}
        title={editingCriteria ? 'Edit Ranking Criteria' : 'Add Ranking Criteria'}
        subtitle={editingCriteria ? 'Update criteria' : 'Create new criteria'}
        width={660}
      >
        <RankingCriteriaForm
          editingCriteria={editingCriteria}
          categoryId={categoryId}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => { setEditingCriteria(null); setDrawerOpen(false); loadData() }}
        />
      </AppDrawer>
    </div>
  )
}

export default RankingCriterias