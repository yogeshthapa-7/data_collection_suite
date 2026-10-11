import { useEffect, useState } from 'react'
import { message, Input } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchEmployees } from '@/features/pages/employee/services/employee.service'
import type { EmployeeItem } from '@/features/pages/employee/types/employee'
import { AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'

const EmployeeInfo = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const {
    data,
    total,
    loading,
    error,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
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
      render: () => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
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
            <Input
              placeholder="Search employees..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </div>
          <Button type={"primary"} icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Clear
          </Button>
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
    </div>
  )
}

export default EmployeeInfo
