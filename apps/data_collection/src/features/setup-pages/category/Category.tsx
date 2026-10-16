import { useState, useEffect, type ReactNode } from 'react'
import { Row, Col, Spin, message, Typography, Modal } from 'antd'
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
import { fetchCategories, getCategoryGroupSelectList, deleteCategory } from '@/features/setup-pages/category/services/category.service'
import type { CategoryItem, CategoryGroupSelectItem } from '@/features/setup-pages/category/types/category'
import { AppSelect, AppSearchInput, AppCard, AppDrawer, AppDropdownMenu, AppPagination, Button } from '@data-collection-suite/ui'
import { convertAdToBs } from '@data-collection-suite/utils'
import { usePaginatedList } from '@data-collection-suite/hooks'
import CategoryForm from './CategoryForm'

type CardDetail = { label: string; value: ReactNode }

const Category = () => {
  const [groupOptions, setGroupOptions] = useState<CategoryGroupSelectItem[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [categoryGroup, setCategoryGroup] = useState<number | undefined>()
  const [categoryCode, setCategoryCode] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)

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
  } = usePaginatedList<CategoryItem>({
    fetcher: ({ start, length }) =>
      fetchCategories(start / length + 1, length, categoryName).then((r) => ({
        items: r.data || [],
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    initialPageSize: 12,
    extraDeps: [categoryName],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

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

  const handleCopyLink = (category: CategoryItem) => {
    message.info(`Copy link: ${category.CategoryName}`)
  }

  const handleOpenQR = (category: CategoryItem) => {
    message.info(`Open QR: ${category.CategoryName}`)
  }

  const handleCloneForm = (category: CategoryItem) => {
    message.info(`Clone form: ${category.CategoryName}`)
  }

  const handleDeploy = (category: CategoryItem) => {
    message.info(`Deploy: ${category.CategoryName}`)
  }

  const handleManageTable = (category: CategoryItem) => {
    message.info(`Manage table: ${category.CategoryName}`)
  }

  const handleDelete = (category: CategoryItem) => {
    Modal.confirm({
      title: 'Delete Category',
      content: `Are you sure you want to delete ${category.CategoryName}?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try{
          await deleteCategory(category.CategoryID)
          message.success('Category deleted successfully')
            refetch()
        } catch {
          message.error('Failed to delete category')
        }
      },
    })
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
              onChange={setCategoryName}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-black">Category Group</label>
            <AppSelect
              placeholder="Select category group"
              value={categoryGroup}
              onChange={(value) => { setCategoryGroup(value); setCurrentPage(1) }}
              className="w-full"
              allowClear
              options={groupOptions.map((group) => ({
                value: group.CategoryGroupID,
                label: group.GroupName,
              }))}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-black">Category Code</label>
            <AppSearchInput
              placeholder="Search by category code"
              value={categoryCode}
              onChange={setCategoryCode}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={() => setCurrentPage(1)}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => { setCategoryName(''); setCategoryGroup(undefined); setCategoryCode(''); setCurrentPage(1) }}>
              Clear
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => {
              setEditingCategory(null)
              setDrawerOpen(true)
            }}
          >
            Add New Category
          </Button>
        </div>
        </div>
        <Row gutter={[16, 16]}>
          {data.map((category) => {
            const details: CardDetail[] = [
              { label: 'Category Group', value: category.CategoryGroupName },
              { label: 'DB Table Name', value: category.DbTableName },
              ...(category.ExpiryDate
                ? [{ label: 'Expiry Date', value: convertAdToBs(category.ExpiryDate) }]
                : []),
              ...(category.Description
                ? [{ label: 'Description', value: category.Description }]
                : []),
              ...(category.CreatedAt
                ? [{ label: 'Created', value: new Date(category.CreatedAt).toLocaleDateString() }]
                : []),
            ]

            return (
              <Col xs={24} sm={12} md={12} lg={8} key={category.CategoryID}>
                <AppCard className="h-full" hover onClick={() => message.info(`Open category: ${category.CategoryName}`)}>
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
                      <Button size="small" style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }} icon={<EditOutlined />} onClick={() => { setEditingCategory(category); setDrawerOpen(true) }}>
                        Edit
                      </Button>
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(category)}>
                        Delete
                      </Button>
                    </div>
                    <AppDropdownMenu
                      trigger={<Button size="small" icon={<MoreOutlined />} />}
                      items={[
                        { label: 'Copy', icon: <LinkOutlined />, onClick: () => handleCopyLink(category) },
                        { label: 'QR', icon: <QrcodeOutlined />, onClick: () => handleOpenQR(category) },
                        { label: 'Clone', icon: <CopyOutlined />, onClick: () => handleCloneForm(category) },
                        { label: 'Deploy', icon: <RocketOutlined />, onClick: () => handleDeploy(category) },
                        { divider: true },
                        { label: 'Manage Table', icon: <TableOutlined />, onClick: () => handleManageTable(category) },
                      ]}
                    />
                  </div>
                </AppCard>
              </Col>
            )
          })}
        </Row>

        <AppPagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />

        {!loading && data.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No categories found
          </div>
        )}
      </Spin>
      <AppDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        subtitle={editingCategory ? `Editing ${editingCategory.CategoryName}` : 'Create a new category'}
        width={660}
      >
        <CategoryForm
          category={editingCategory}
          onCancel={() => setDrawerOpen(false)}
          onSuccess={() => {
            setEditingCategory(null)
            setDrawerOpen(false)
            refetch()
          }}
        />
      </AppDrawer>
    </div>
  )
}

export default Category
