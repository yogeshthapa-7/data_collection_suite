import { useEffect, useState } from 'react'
import { message, Modal, Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { AppSearchInput, AppTable, Button, AppDrawer } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { fetchBranches, deleteBranch } from '@/features/pages/branch/services/branch.service'
import type { BranchItem } from '@/features/pages/branch/types/branch'
import BranchForm from './BranchForm'

const Branch = () => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerBranch, setDrawerBranch] = useState<BranchItem | null>(null)

  const tabs = [
    { key: '/departments', label: 'Departments' },
    { key: '/main-branch', label: 'Main-Branch' },
    { key: '/branch', label: 'Branch' },
  ]

  const { data, total, loading, error, currentPage, pageSize, setCurrentPage, setPageSize, refetch } = usePaginatedList<BranchItem>({
    fetcher: ({ start, length }) =>
      fetchBranches(start / length + 1, length, searchInput).then((r) => ({
        items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    extraDeps: [searchInput],
  })

  useEffect(() => { if (error) message.error(error) }, [error])

  const handleDelete = (item: BranchItem) => {
    Modal.confirm({
      title: 'Delete Branch',
      content: `Are you sure you want to delete ${item.BranchName}?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBranch(item.BranchID)
          message.success('Branch deleted successfully')
          refetch()
        } catch {
          message.error('Failed to delete branch')
        }
      },
    })
  }

    const columns = [
    { title: 'SN', dataIndex: 'SN', key: 'SN', width: 60 },
    { title: 'Branch Code', dataIndex: 'BranchCode', key: 'BranchCode' },
    { title: 'Branch Name', dataIndex: 'BranchName', key: 'BranchName' },
    { title: 'Main Branch Name', dataIndex: 'MainBranchName', key: 'MainBranchName', render: (v: any) => v || ' ' },
    { title: 'Department Name', dataIndex: 'DepartmentName', key: 'DepartmentName', render: (v: any) => v || ' ' },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (r: BranchItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onClick={() => {
    setDrawerBranch(r)
    setDrawerOpen(true)
  }}
          >
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <Tabs activeKey={location.pathname} onChange={navigate} items={tabs} className="mb-4" />
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Branch Name</label>
            <AppSearchInput
              placeholder="Search branches..."
              value={searchInput}
              onChange={setSearchInput}
              onPressEnter={() => { setCurrentPage(1); }}
            />
          </div>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => setCurrentPage(1)}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setSearchInput(''); setCurrentPage(1); }}>
            Clear
          </Button>
          <Button type="primary" icon={<PlusOutlined />} className="ml-auto"
          onClick={() => setDrawerOpen(true)}>
            Add New Branch
          </Button>
        </div>
      </div>
      <AppTable<BranchItem>
        columns={columns}
        dataSource={data}
        rowKey="BranchID"
        loading={loading}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        scroll={{ x: 800 }}
      />
      <AppDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerBranch(null) }}
        title={drawerBranch ? 'Edit Branch' : 'Add Branch'}
        subtitle={drawerBranch ? 'Update branch details' : 'Create a new branch'}
        width={520}
      >
         <BranchForm
          branch={drawerBranch}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerBranch(null)
            setDrawerOpen(false)
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default Branch