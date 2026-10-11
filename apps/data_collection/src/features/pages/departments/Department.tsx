import { useEffect, useState } from 'react'
import { message, Input } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchDepartments } from '@/features/pages/departments/services/department.service'
import type { DepartmentItem } from '@/features/pages/departments/types/department'
import { AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'

const Department = () => {
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
              placeholder="Search departments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </div>
          <Button type={'primary'} icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Clear
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
    </div>
  )
}

export default Department
