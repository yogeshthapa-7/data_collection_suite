import { useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchEmployees, deleteEmployee } from '@/features/setup-pages/employee/services/employee.service'
import type { EmployeeItem } from '@/features/setup-pages/employee/types/employee'
import { AppSearchInput, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { AppDrawer } from '@data-collection-suite/ui'
import EmployeeForm from './EmployeeForm'

const EmployeeInfo = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerEmployee, setDrawerEmployee] = useState<EmployeeItem | null>(null)

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
  } = usePaginatedList<EmployeeItem>({
    fetcher: ({ start, length }) =>
      fetchEmployees(start / length + 1, length, searchText).then((r) => ({
        items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    extraDeps: [searchText],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleSearch =() => {
    setSearchText(searchInput)
    setCurrentPage(1)
  }

  const handleReset = () =>{
    setSearchInput('')
    setSearchText('')
    }

  const handleDelete = (employee: EmployeeItem) => {
  Modal.confirm({
    title: 'Delete Employee',
    content: `Are you sure you want to delete ${employee.Fullname}?`,
    icon: <DeleteOutlined />,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteEmployee(employee.EmployeeInfoID)
        message.success('Employee deleted successfully')
        refetch()
      } catch {
        message.error('Failed to delete employee')
      }
    },
  })
}

  const columns = [
    {
      title: 'SN',
      dataIndex: 'SN',
      key: 'SN',
      width: 60,
    },
    {
      title: 'Full Name',
      dataIndex: 'Fullname',
      key: 'Fullname',
      width: 200,
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
      title: 'DOB',
      dataIndex: 'DOB',
      key: 'DOB',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : ' '),
    },
    {
      title: 'Department',
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (record: EmployeeItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onClick={() => {
              setDrawerEmployee(record)
              setDrawerOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
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
            <label className="mb-1 block text-sm font-bold text-slate-700">Full Name</label>
            <AppSearchInput
              placeholder="Search employees..."
              value={searchInput}
              onChange={setSearchInput}
              onPressEnter={handleSearch}
            />
          </div>
          <Button type={"primary"} icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Clear
          </Button>
          <Button
          type={'primary'}
          icon={<PlusOutlined />}
          className='ml-auto'
          onClick={() => setDrawerOpen(true)}
          >Add New Employee</Button>
        </div>
      </div>

      <AppTable<EmployeeItem>
        columns={columns}
        dataSource={data}
        rowKey="EmployeeInfoID"
        loading={loading}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        scroll={{ x: 1200 }}
      />
      <AppDrawer
        title={drawerEmployee ? 'Edit Employee' : 'Add New Employee'}
        subtitle={drawerEmployee ? 'Update employee details' : 'Create new employee'}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerEmployee(null) }}
        width={700}
      >
        <EmployeeForm
           employee={drawerEmployee}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerEmployee(null)
            setDrawerOpen(false)
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default EmployeeInfo
