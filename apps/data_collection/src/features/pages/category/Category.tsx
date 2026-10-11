import { useState, useEffect, type ReactNode } from 'react'
import { Row, Col, Spin, message, Select, Dropdown, Typography } from 'antd'
import {
  SearchOutlined,
  FileTextOutlined,
  CopyOutlined,
  QrcodeOutlined,
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  RocketOutlined,
  TableOutlined,
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { fetchCategories, getCategoryGroupSelectList } from '@/features/pages/category/services/category.service'
import type { CategoryItem, CategoryGroupSelectItem } from '@/features/pages/category/types/category'
import { Button } from '@data-collection-suite/ui'
import { AppSearchInput, AppCard, AppDrawer } from '@data-collection-suite/ui'
import CategoryForm from './CategoryForm'

type CardDetail = { label: string; value: ReactNode }

const Category = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [groupOptions, setGroupOptions] = useState<CategoryGroupSelectItem[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryGroup, setCategoryGroup] = useState<number | undefined>()
  const [categoryCode, setCategoryCode] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await fetchCategories(1, 10, '')
      setCategories(response.data || [])
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Unknown error'
      message.error(`Failed to fetch categories: ${msg}`)
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getCategoryGroupSelectList()
        // console.log('Category group select list:', response)
        setGroupOptions(response)
      } catch (error) {
        console.error('Failed to fetch category groups', error)
      }
    }
    fetchGroups()
  }, [])

  const handleFilterChange = () => {
    loadCategories()
  }

  return (
    <div className="p-6">

      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-black">Category Name</label>
            <AppSearchInput
              placeholder="Search by category name"
              value={categoryName}
              onChange={(value) => { setCategoryName(value); handleFilterChange() }}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-black">Category Group</label>
            <Select
              placeholder="Select category group"
              value={categoryGroup}
              onChange={(value) => { setCategoryGroup(value); handleFilterChange() }}
              className="w-full"
              allowClear
            >
              {groupOptions.map((group) => (
                <Select.Option key={group.CategoryGroupID} value={group.CategoryGroupID}>
                  {group.GroupName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-black">Category Code</label>
            <AppSearchInput
              placeholder="Search by category code"
              value={categoryCode}
              onChange={(value) => { setCategoryCode(value); handleFilterChange() }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilterChange}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => { setCategoryName(''); setCategoryGroup(undefined); setCategoryCode(''); setTimeout(handleFilterChange, 0) }}>
              Clear
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setDrawerOpen(true)}
          >
            Add New Category
          </Button>
        </div>
        </div>
        <Row gutter={[16, 16]}>
          {categories.map((category) => {
            const details: CardDetail[] = [
              { label: 'Category Group', value: category.CategoryGroupName },
              { label: 'DB Table Name', value: category.DbTableName },
              ...(category.Description
                ? [{ label: 'Description', value: category.Description }]
                : []),
              ...(category.CreatedAt
                ? [{ label: 'Created', value: new Date(category.CreatedAt).toLocaleDateString() }]
                : []),
            ]

            return (
              <Col xs={24} sm={12} md={12} lg={8} key={category.CategoryID}>
                <AppCard className="h-full">
                  <div className="mb-4 flex items-start justify-between">
                    <Typography.Title level={5} className="!mb-0 !font-semibold !text-gray-800">
                      {category.CategoryName}
                    </Typography.Title>
                    <Button size="small" type="primary" icon={<FileTextOutlined />}>
                      Open Form
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {details.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 text-sm">
                        <Typography.Text type="secondary" className="shrink-0">
                          {item.label}
                        </Typography.Text>
                        <div className="truncate text-right font-medium text-gray-700">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-b border-slate-200 my-3" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button size="small" style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }} icon={<EditOutlined />}>
                        Edit
                      </Button>
                      <Button size="small" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </div>
                    <Dropdown
                      menu={{
                        items: [
                          { key: 'copy', icon: <LinkOutlined />, label: 'Copy' },
                          { key: 'qr', icon: <QrcodeOutlined />, label: 'QR' },
                          { key: 'clone', icon: <CopyOutlined />, label: 'Clone' },
                          { key: 'deploy', icon: <RocketOutlined />, label: 'Deploy' },
                          { type: 'divider' },
                          { key: 'table', icon: <TableOutlined />, label: 'Manage Table' },
                        ],
                      }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                </AppCard>
              </Col>
            )
          })}
        </Row>

        {!loading && categories.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No categories found
          </div>
        )}
      </Spin>
      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Category"
        subtitle="Create a new category"
        width={560}
      >
        <CategoryForm
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerOpen(false)
            loadCategories()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default Category
