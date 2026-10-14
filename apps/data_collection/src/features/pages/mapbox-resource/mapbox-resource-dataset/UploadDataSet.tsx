import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { message, Modal } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { AppSearchInput, AppTable, Button, AppDrawer } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import {
  fetchDataSets,
  deleteDataSet,
} from '@/features/pages/mapbox-resource/mapbox-resource-dataset/services/dataset.service'
import type {
  DataSetItem,
} from '@/features/pages/mapbox-resource/mapbox-resource-dataset/types/dataset'
import DataSetForm from './DataSetForm'

const UploadDataSet = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerDataSet, setDrawerDataSet] = useState<DataSetItem | null>(null)

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
  } = usePaginatedList<DataSetItem>({
    fetcher: async ({ start, length }) => {
      const rows = await fetchDataSets(name)
      return {
        items: rows
          .slice(start, start + length)
          .map((item, index) => ({ ...item, SN: start + index + 1 })),
        total: rows.length,
      }
    },
    extraDeps: [name],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleDelete = (item: DataSetItem) => {
  Modal.confirm({
    title: 'Delete Data Set',
    content: `Are you sure you want to delete ${item.name}?`,
    icon: <DeleteOutlined />,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteDataSet(item.id)
        message.success('Data set deleted successfully')
        refetch()
      } catch {
        message.error('Failed to delete data set')
      }
    },
  })
}

  const columns = [
    { title: 'S.N', dataIndex: 'SN', key: 'SN', width: 60 },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (v: string) => v || ' ' },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (record: DataSetItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
            icon={<EditOutlined />}
            onClick={() => { setDrawerDataSet(record); setDrawerOpen(true) }}
          >
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
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
            <label className="mb-1 block text-sm font-bold text-slate-700">Name</label>
            <AppSearchInput
              placeholder="Search by name"
              value={name}
              onChange={setName}
              onPressEnter={() => setCurrentPage(1)}
            />
          </div>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => setCurrentPage(1)}>
            Search
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { setDrawerDataSet(null); setDrawerOpen(true) }}
            >
              Add New Data Set
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/mapbox-resource/upload-file')}>
              Upload Data Set
            </Button>
          </div>
        </div>
      </div>

      <AppTable<DataSetItem>
        columns={columns}
        dataSource={data}
        rowKey="id"
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
        onClose={() => { setDrawerOpen(false); setDrawerDataSet(null) }}
        title={drawerDataSet ? 'Edit Data Set' : 'Add New Data Set'}
        subtitle={drawerDataSet ? 'Update data set here' : 'Create new data set here'}
        width={600}
      >
        <DataSetForm
          dataSet={drawerDataSet}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => { setDrawerDataSet(null); setDrawerOpen(false); refetch() }}
        />
      </AppDrawer>
    </div>
  )
}

export default UploadDataSet