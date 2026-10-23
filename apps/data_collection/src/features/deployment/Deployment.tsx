import { useEffect, useState, type ReactNode } from 'react'
import { Row, Col, Spin, message, Typography, Modal } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { AppSearchInput, AppCard, AppDrawer, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import {
  fetchDeploymentInfo,
  deleteDeployment,
  userServerSearch,
  getCandidateCollectorForCategory,
} from '@/features/deployment/services/deployment.service'
import type { DeploymentItem, UserSelectItem } from '@/features/deployment/types/deployment'

const tabs = [
  { key: '/category', label: 'Category' },
  { key: '/form-data', label: 'Form Data' },
]

const Deployment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [categoryID, setCategoryID] = useState<number>(16)

  const [searchText, setSearchText] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingDeployment, setEditingDeployment] = useState<DeploymentItem | null>(null)
  const [users, setUsers] = useState<UserSelectItem[]>([])

  const {
    data,
    total,
    loading,
    error,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refetch,
  } = usePaginatedList<DeploymentItem>({
    fetcher: ({ start, length }) =>
      fetchDeploymentInfo(0, categoryID).then((r) => ({
        items: r.data || [],
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    initialPageSize: 12,
    extraDeps: [categoryID, searchText],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const u = await userServerSearch()
        setUsers(u)
      } catch {
        message.error('Failed to load users')
      }
    }
    loadUsers()
  }, [])

  const handleDelete = (item: DeploymentItem) => {
    Modal.confirm({
      title: 'Delete Deployment',
      content: `Are you sure you want to delete "${item.Title}"?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteDeployment(item.CategoryDeploymentInfoID)
          message.success('Deployment deleted successfully')
          refetch()
        } catch {
          message.error('Failed to delete deployment')
        }
      },
    })
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchText('')
    setCurrentPage(1)
  }

  return (
    <div className="p-6">
      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-64">
              <label className="mb-1 block text-sm font-bold text-black">Search</label>
              <AppSearchInput
                placeholder="Search deployments..."
                value={searchText}
                onChange={setSearchText}
                onPressEnter={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Clear
              </Button>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="ml-auto"
              onClick={() => {
                setEditingDeployment(null)
                setDrawerOpen(true)
              }}
            >
              Add New Deployment
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {data.map((deployment) => {
            const collectors = deployment.CollectorsArray
              ? users.filter((u) => deployment.CollectorsArray?.split(',').map(Number).includes(u.UserId)).map((u) => u.UserName).join(', ')
              : ''

            const managers = deployment.ManagersArray
              ? users.filter((u) => deployment.ManagersArray?.split(',').map(Number).includes(u.UserId)).map((u) => u.UserName).join(', ')
              : ''

            return (
              <Col xs={24} sm={12} md={12} lg={8} key={deployment.CategoryDeploymentInfoID}>
                <AppCard className="h-full" hover>
                  <div className="mb-4 flex items-start justify-between">
                    <Typography.Title level={5} className="!mb-0 !font-semibold !text-gray-800">
                      {deployment.Title}
                    </Typography.Title>
                    <Button
                      size="small"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingDeployment(deployment)
                        setDrawerOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <Typography.Text type="secondary" className="shrink-0">
                        Collectors
                      </Typography.Text>
                      <div className="truncate text-right font-medium text-gray-700">
                        {collectors || '-'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <Typography.Text type="secondary" className="shrink-0">
                        Managers
                      </Typography.Text>
                      <div className="truncate text-right font-medium text-gray-700">
                        {managers || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-slate-200 my-3" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingDeployment(deployment)
                          setDrawerOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(deployment)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </AppCard>
              </Col>
            )
          })}
        </Row>
      </Spin>

      <AppDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingDeployment(null)
        }}
        title={editingDeployment ? 'Edit Deployment' : 'Add Deployment'}
        subtitle={editingDeployment ? 'Update deployment details' : 'Create a new deployment'}
        width={600}
      >
        <DeploymentForm
          editingDeployment={editingDeployment}
          users={users}
          categoryID={categoryID}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setEditingDeployment(null)
            setDrawerOpen(false)
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

interface DeploymentFormProps {
  editingDeployment: DeploymentItem | null
  users: UserSelectItem[]
  categoryID: number
  onCancel: () => void
  onSuccess: () => void
}

const DeploymentForm = ({ editingDeployment, users, categoryID, onCancel, onSuccess }: DeploymentFormProps) => {
  const [title, setTitle] = useState(editingDeployment?.Title ?? '')
  const [collectors, setCollectors] = useState<string>(editingDeployment?.CollectorsArray ?? '')
  const [managers, setManagers] = useState<string>(editingDeployment?.ManagersArray ?? '')
  const [saving, setSaving] = useState(false)

  const userOptions = users.map((u) => ({ value: u.UserId, label: u.UserName }))

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await fetchDeploymentInfo(0, categoryID)
      message.success('Deployment saved')
      onSuccess()
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save deployment')
    } finally {
      setSaving(false)
    }
  }

  const collectorsSelected = collectors ? collectors.split(',').filter(Boolean).map(Number) : []
  const managersSelected = managers ? managers.split(',').filter(Boolean).map(Number) : []

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-slate-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter title"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-slate-700">Collectors</label>
        <AppSelect
          placeholder="Select collectors"
          options={userOptions}
          value={collectorsSelected}
          onChange={(vals) => setCollectors((vals as number[]).join(','))}
          mode="multiple"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-slate-700">Managers</label>
        <AppSelect
          placeholder="Select managers"
          options={userOptions}
          value={managersSelected}
          onChange={(vals) => setManagers((vals as number[]).join(','))}
          mode="multiple"
        />
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="primary" loading={saving} onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  )
}

export default Deployment
