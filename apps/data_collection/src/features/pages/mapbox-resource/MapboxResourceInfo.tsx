import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, message, Modal } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchMapboxResources, deleteMapboxResource } from '@/features/pages/mapbox-resource/services/mapbox-resource.service'
import type { MapboxResourceItem, MapboxResourceFilterValues } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { getLayerTypeLabel, getResourceTypeLabel, RESOURCE_TYPE_OPTIONS } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { AppInput, AppSelect, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { AppDrawer } from '@data-collection-suite/ui'
import MapboxResourceForm from './MapboxResourceForm'

const MapboxResourceInfo = () => {
  const [filterForm] = Form.useForm()
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [appliedFilter, setAppliedFilter] = useState<MapboxResourceFilterValues>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerResource, setDrawerResource] = useState<MapboxResourceItem | null>(null)

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
  } = usePaginatedList<MapboxResourceItem>({
    fetcher: ({ start, length }) =>
      fetchMapboxResources(start / length + 1, length, searchText, appliedFilter).then((r) => ({
        items: (r.data || []).map((item, index) => ({ ...item, SN: start + index + 1 })),
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    extraDeps: [searchText, appliedFilter],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleApplyFilter = (values: MapboxResourceFilterValues) => {
    setAppliedFilter(values)
    setCurrentPage(1)
  }

  const handleResetFilter = () => {
    filterForm.resetFields()
    setAppliedFilter({})
    setSearchText('')
    setCurrentPage(1)
  }

  const openNewDrawer = () => {
    setDrawerResource(null)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerResource(null)
  }

  const handleDelete = (resource: MapboxResourceItem) => {
     const id = Number(
    (resource as unknown as Record<string, unknown>).MapboxResourceInfoId ??
      resource.MapboxResourceInfoID
  )
  Modal.confirm({
    title: 'Delete Mapbox Resource',
    content: `Are you sure you want to delete ${resource.ResourceName}?`,
    icon: <DeleteOutlined />,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteMapboxResource(id)
        message.success('Resource deleted successfully')
        refetch()
      } catch {
        message.error('Failed to delete resource')
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
      title: 'Resource Name',
      dataIndex: 'ResourceName',
      key: 'ResourceName',
    },
    {
      title: 'Category Code',
      dataIndex: 'CategoryCode',
      key: 'CategoryCode',
      render: (value: string) => (value && value.trim() !== '.' ? value : ''),
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
      render: (value: string) => (value && value.trim() !== '.' ? value : ''),
    },
    {
      title: 'Layer Type',
      dataIndex: 'LayerType',
      key: 'LayerType',
      render: (id: number) => getLayerTypeLabel(id),
    },
    {
      title: 'Unique Feature Key',
      dataIndex: 'UniqueFeatureKey',
      key: 'UniqueFeatureKey',
      render: (value: string) => value || ' ',
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (record: MapboxResourceItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onClick={() => {
              setDrawerResource(record)
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
        <Form form={filterForm} layout="vertical" onFinish={handleApplyFilter} requiredMark={false}>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-4">
            <Form.Item name="ResourceName">
              <AppInput label="Resource Name" placeholder="Enter resource name" />
            </Form.Item>
            <Form.Item name="MapboxId">
              <AppInput label="Mapbox Id" placeholder="Enter mapbox id" />
            </Form.Item>
            <Form.Item name="CategoryCode">
              <AppInput label="Category Code" placeholder="Enter category code" />
            </Form.Item>
            <Form.Item name="ResourceType">
              <AppSelect label="Resource Type" placeholder="Select ResourceType" options={RESOURCE_TYPE_OPTIONS} allowClear />
            </Form.Item>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
              Clear
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openNewDrawer}>
              Add New Resource
            </Button>
            <Button type="primary" onClick={() => navigate('/mapbox-resource/upload-data-set')}>
              Upload Data Set
            </Button>
          </div>
        </Form>
      </div>

      <AppTable<MapboxResourceItem>
        columns={columns}
        dataSource={data}
        rowKey="MapboxResourceInfoID"
        loading={loading}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        scroll={{ x: 1200 }}
      />
      <AppDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={drawerResource ? 'Edit Mapbox Resource' : 'Add Mapbox Resource'}
        subtitle={drawerResource ? 'Update mapbox resource' : 'Create New Mapbox Resource'}
        width={600}
      >
        <MapboxResourceForm
          resource={drawerResource}
          onCancel={closeDrawer}
          onSuccess={() => {
            closeDrawer()
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default MapboxResourceInfo
