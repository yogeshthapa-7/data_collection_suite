import { useEffect, useState } from 'react'
import { message, Input, Space } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchUsers } from '@/features/pages/users/services/users.service'
import type { UserItem } from '@/features/pages/users/types/users'
import { AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'

const Users = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, serSearchInput] = useState('')

  const {
    data,
    total,
    loading,
    error,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  } = usePaginatedList<UserItem>({
    fetcher: ({ start, length }) =>
  fetchUsers(start / length + 1, length, searchText).then((r) => ({
    items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
    total: r.recordsFiltered ?? r.recordsTotal ?? 0,
  })),
    extraDeps: [searchText],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleSearch = () =>{
    setCurrentPage(1)
    setSearchText(searchInput)
  }

  const handleReset = () => {
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
      title: 'User Name',
      dataIndex: 'UserName',
      key: 'UserName',
    },
    {
      title: 'User Group',
      dataIndex: 'UserGroupName',
      key: 'UserGroupName',
    },
    {
      title: 'Theme',
      dataIndex: 'Theme',
      key: 'Theme',
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
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              onClear={handleReset}
            />
          </div>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Clear
            </Button>
          </Space>
        </div>
      </div>

      <AppTable<UserItem>
        columns={columns}
        dataSource={data}
        rowKey={(record: UserItem) => String(record.UserId ?? record.SN)}
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

export default Users