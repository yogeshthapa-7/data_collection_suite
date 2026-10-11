import { useState, useEffect } from 'react'
import { Spin, message, Input, Space } from 'antd'
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { fetchMapboxResources } from '@/features/pages/mapbox-resource/services/mapbox-resource.service'
import type { MapboxResourceItem, MapboxResourceServerSearchResponse } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { getLayerTypeLabel } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { getResourceTypeLabel } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import UiTable from '@/shared/components/ui/ui-table'
import { Button } from '@data-collection-suite/ui'

const MapboxResourceInfo = () => {
  const [data, setData] = useState<MapboxResourceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchData = async (page: number = 1, pageSize: number = 10, search: string = '') => {
    setLoading(true)
    try {
      const response: MapboxResourceServerSearchResponse = await fetchMapboxResources(page, pageSize, search)
      setData(response.data || [])
      setPagination({
        current: page,
        pageSize,
        total: response.recordsTotal || 0,
      })
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Unknown error'
      message.error(`Failed to fetch mapbox resources: ${msg}`)
      console.error('Failed to fetch mapbox resources:', error)
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
      title: 'Resource Name',
      dataIndex: 'ResourceName',
      key: 'ResourceName',
    },
    {
      title: 'Category Code',
      dataIndex: 'CategoryCode',
      key: 'CategoryCode',
      render: (value: string) => (value && value.trim() !== '.' ? value: ''),
    },
    {
      title: 'Resource Type',
      dataIndex: 'ResourceType',
      key: 'ResourceType',
      render: (id: number) => getResourceTypeLabel(id),
    },
    {
      title: 'Mapbox ID',
      dataIndex: 'MapboxId',
      key: 'MapboxId',
      width: 250,
      render: (id: string) => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>
          {id || ' '}
        </div>
      ),
    },
    {
      title: 'Mapbox Name',
      dataIndex: 'MapboxName',
      key: 'MapboxName',
      render: (value: string) => (value && value.trim() !== '.' ? value: ''),
    },
    {
      title: 'Layer Type',
      dataIndex: 'LayerType',
      key: 'LayerType',
      render: (id: number) => getLayerTypeLabel(id),
    },
        {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_: any, _record: MapboxResourceItem) => (
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
              placeholder="Search mapbox resources..."
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
        <UiTable<MapboxResourceItem>
        columns={columns}
        dataSource={data}
        rowKey="MapboxResourceID"
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

export default MapboxResourceInfo
