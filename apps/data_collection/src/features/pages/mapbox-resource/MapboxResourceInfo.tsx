import { useEffect, useState } from 'react'
import { message } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchMapboxResources } from '@/features/pages/mapbox-resource/services/mapbox-resource.service'
import type { MapboxResourceItem } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { getLayerTypeLabel, getResourceTypeLabel } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { AppSearchInput, AppTable, Button } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import { AppDrawer } from '@data-collection-suite/ui'
import MapboxResourceForm from './MapboxResourceForm'

const MapboxResourceInfo = () => {
  const [searchText, setSearchText] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  

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
      fetchMapboxResources(start / length + 1, length, searchText).then((r) => ({
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
            <label className="mb-1 block text-sm font-bold text-slate-700">Resource Name</label>
            <AppSearchInput
              placeholder="Search mapbox resources..."
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
          type={'primary'}
          icon={<PlusOutlined />}
          className='ml-auto'
            onClick={() => setDrawerOpen(true)}
          >
            Add Mapbox Resource
          </Button>
        </div>
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
        onClose={() => setDrawerOpen(false)}
        title="Add Mapbox Resource"
        subtitle="Create New Mapbox Resource"
        width={520}
      >
        <MapboxResourceForm 
        onCancel={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false)
          refetch()
        }}
        />
      </AppDrawer>
    </div>
  )
}

export default MapboxResourceInfo
