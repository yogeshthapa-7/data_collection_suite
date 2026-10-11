import { useState, useEffect } from 'react'
import { Spin, message, Input, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { fetchEmployees } from '@/features/pages/employee/services/employee.service'
import type { EmployeeItem } from '@/features/pages/employee/types/employee'
import UiTable from '@/shared/components/ui/ui-table'
import { Button } from '@data-collection-suite/ui'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const EmployeeInfo = () => {
  const [data, setData] = useState<EmployeeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchData = async (page: number = 1, pageSize: number = 10, search: string = '') => {
    setLoading(true)
    try {
      const response = await fetchEmployees(page, pageSize, search)
      setData(response.data || [])
      setPagination({
        current: page,
        pageSize,
        total: response.recordsTotal || 0,
      })
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Unknown error'
      message.error(`Failed to fetch employees: ${msg}`)
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, pagination.pageSize, searchText)
  }

  const handleSearch = () => {
    fetchData(1, pagination.pageSize, searchText)
  }

  const handleReset = () => {
    setSearchText('')
    fetchData(1, pagination.pageSize, '')
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
      render: (_: any, _record: EmployeeItem) => (
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </div>
      </div>
      <Spin spinning={loading}>
        <UiTable<EmployeeItem>
          columns={columns}
          dataSource={data}
          rowKey={(record: EmployeeItem) => String(record.EmployeeInfoID ?? record.SN)}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Spin>
    </div>
  )
}

export default EmployeeInfo
