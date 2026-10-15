import { useEffect, useState } from 'react'
import { message, Modal, Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { AppSearchInput, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { fetchMainBranches } from '@/features/pages/main-branch/services/main-branch.service'
import type { MainBranchItem } from '@/features/pages/main-branch/types/main-branch'

const MainBranch = () => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { key: '/departments', label: 'Departments' },
    { key: '/main-branch', label: 'Main-Branch' },
    { key: '/branch', label: 'Branch' },
  ]

  const { data, total, loading, error, currentPage, pageSize, setCurrentPage, setPageSize, refetch } = usePaginatedList<MainBranchItem>({
    fetcher: ({ start, length }) =>
      fetchMainBranches(start / length + 1, length, searchInput).then((r) => ({
        items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    extraDeps: [searchInput],
  })

  useEffect(() => { if (error) message.error(error) }, [error])

  const handleDelete = (item: MainBranchItem) => {
    Modal.confirm({
      title: 'Delete Main Branch',
      content: `Are you sure you want to delete ${item.MainBranchName}?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          // await deleteMainBranch(item.MainBranchID)
          message.success('Main Branch deleted successfully')
          refetch()
        } catch {
          message.error('Failed to delete main branch')
        }
      },
    })
  }

  const columns = [
    { title: 'SN', dataIndex: 'SN', key: 'SN', width: 60 },
    { title: 'Main Branch Code', dataIndex: 'MainBranchCode', key: 'MainBranchCode' },
    { title: 'Main Branch Name', dataIndex: 'MainBranchName', key: 'MainBranchName' },
    { title: 'Department Name', dataIndex: 'DepartmentName', key: 'DepartmentName', render: (v: any) => v || ' ' },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (r: MainBranchItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
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
            <label className="mb-1 block text-sm font-bold text-slate-700">Main Branch Name</label>
            <AppSearchInput
              placeholder="Search main branches..."
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
          <Button type="primary" icon={<PlusOutlined />} className="ml-auto">
            Add New Main Branch
          </Button>
        </div>
      </div>
      <AppTable<MainBranchItem>
        columns={columns}
        dataSource={data}
        rowKey="MainBranchID"
        loading={loading}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        scroll={{ x: 800 }}
      />
    </div>
  )
}

export default MainBranch