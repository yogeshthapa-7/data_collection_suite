import { useEffect, useState } from 'react'
import { message } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchDepartments } from '@/features/pages/departments/services/department.service'
import type { DepartmentItem } from '@/features/pages/departments/types/department'
import { AppSearchInput, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { AppDrawer } from '@data-collection-suite/ui'
import DepartmentForm from './DepartmentForm'

const Department = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDepartment, setDrawerDepartment] = useState<DepartmentItem | null>(null)

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
  } = usePaginatedList<DepartmentItem>({
   fetcher: ({ start, length }) =>
     fetchDepartments(start / length + 1, length, searchText).then((r) => ({
       items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
       total: r.recordsFiltered ?? r.recordsTotal ?? 0,
     })),
    extraDeps: [searchText],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchText(searchInput)
  }

  const handleReset = () => {
    setSearchText('')
    setSearchInput('')
    }

  const columns = [
    {
      title: 'SN',
      dataIndex: 'SN',
      key: 'SN',
      width: 60,
    },
    {
      title: 'Department Name',
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
    },
    {
      title: 'Department Code',
      dataIndex: 'DepartmentCode',
      key: 'DepartmentCode',
    },
    {
      title: 'Parent Department',
      dataIndex: 'ParentDepartmentName',
      key: 'ParentDepartmentName',
      render: (value: string) => value || '',
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (record: DepartmentItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onCLick={() => {
              setDrawerDepartment(record)
              setDrawerOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Department Name</label>
            <AppSearchInput
              placeholder="Search departments..."
              value={searchInput}
              onChange={setSearchInput}
              onPressEnter={handleSearch}
            />
          </div>
          <Button type={'primary'} icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Clear
          </Button>
             <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setDrawerOpen(true)}
          >
            Add New Department
          </Button>
        </div>
      </div>

      <AppTable<DepartmentItem>
        columns={columns}
        dataSource={data}
        rowKey="DepartmentID"
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
        onClose={() => { setDrawerOpen(false); setDrawerDepartment(null) }}
        title={drawerDepartment ? 'Edit Department' : 'Add Department'}
        subtitle={drawerDepartment ? 'Update department details' : 'Create a new department'}
        width={520}
      >
        <DepartmentForm
          department={drawerDepartment}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerDepartment(null)
            setDrawerOpen(false)
            refetch()          // from usePaginatedList — refreshes the table
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default Department
