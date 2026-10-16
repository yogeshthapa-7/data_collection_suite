import { useEffect, useState } from 'react'
import { message, Space, Modal } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchUsers, deleteUser } from '@/features/pages/users/services/users.service'
import type { UserItem } from '@/features/pages/users/types/users'
import { AppSearchInput, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { AppDrawer } from '@data-collection-suite/ui'
import UserForm from './UserForm'

const Users = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null)

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

  const handleDelete = (user: UserItem) =>{
    Modal.confirm({
      title: 'Delete Users',
      content: `Are you sure you want to delete ${user.UserName}`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteUser(user.UserId)
          message.success('User deleted successfully')
          refetch()
        } catch {
          message.error('Failed to delete user')
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
      render: (record: UserItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onClick={() => {
              setDrawerUser(record)
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
            <label className="mb-1 block text-sm font-bold text-slate-700">User Name</label>
            <AppSearchInput
              placeholder="Search users..."
              value={searchInput}
              onChange={setSearchInput}
              onPressEnter={handleSearch}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setDrawerOpen(true)}
          >
            Add New User
          </Button>
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
      <AppDrawer
      open={drawerOpen}
      onClose={() => {setDrawerOpen(false)
        setDrawerUser(null)
      }}
       title={drawerUser ? 'Edit User' : 'Add New User'}
        subtitle={drawerUser ? 'Update user details' : 'Create a new user'}
        width={560}
      >
        <UserForm
        user={drawerUser}
          onCancel={() => {setDrawerOpen(false)
            setDrawerUser(null)
          }}
          onSuccess={() => {
            setDrawerOpen(false)
            setDrawerUser(null)
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default Users