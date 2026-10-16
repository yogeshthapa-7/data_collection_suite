import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Row, Col, Spin, message, Typography, Modal } from 'antd'
import { SearchOutlined, HomeOutlined, CarryOutOutlined, HeartOutlined, ToolOutlined, BookOutlined, PhoneOutlined, ApartmentOutlined, ShoppingOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteCategoryGroup, fetchCategoryGroups } from '@/features/setup-pages/category-group/services/category-group.service'
import type {
  CategoryGroupItem,
} from '@/features/setup-pages/category-group/types/category-type'
import { AppCard, AppSearchInput, Button, AppPagination } from '@data-collection-suite/ui'
import { AppDrawer } from '@data-collection-suite/ui'
import { usePaginatedList } from '@data-collection-suite/hooks'
import CategoryGroupForm from './CategoryGroupForm'

const iconMap: Record<string, ReactNode> = {
  'fa fa-home': <HomeOutlined />,
  'fa fa-road': <CarryOutOutlined />,
  'fa fa-address-book': <HeartOutlined />,
  'fa fa-address-book-o': <PhoneOutlined />,
  'fa fa-adn': <ToolOutlined />,
  'fa fa-500px': <BookOutlined />,
  'fa fa-building': <ApartmentOutlined />,
  'fa fa-shopping-cart': <ShoppingOutlined />,
}

const CategoryGroup = () => {
  const [groupName, setGroupName] = useState('')
  const [groupCode, setGroupCode] = useState('')
  const [icon, setIcon] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerGroup, setDrawerGroup] = useState<CategoryGroupItem | null>(null)

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
  } = usePaginatedList<CategoryGroupItem>({
    fetcher: ({ start, length }) =>
      fetchCategoryGroups(start / length + 1, length, appliedSearch).then((r) => ({
        items: r.data || [],
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
      extraDeps: [appliedSearch],
  })

  useEffect(() => {
    if(error) message.error(error)
  }, [error])

  const getIcon = (icon?: string) => {
    if (!icon) return <HomeOutlined />
    return iconMap[icon] || <HomeOutlined />
  }

  const handleSearch = () => {
    setAppliedSearch(groupName)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setGroupName('')
    setGroupCode('')
    setIcon('')
    setAppliedSearch('')
    setCurrentPage(1)
  }

  const handleGroupClick = (group: CategoryGroupItem) => {
    message.info(`Group selected: ${group.GroupName}`)
  }

  const handleDelete = (group: CategoryGroupItem) => {
    Modal.confirm({
      title: 'Delete Category Group',
      content: `Are you sure you want to delete ${CategoryGroup.CategoryGroupName}?`,
      icon: <DeleteOutlined />,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCategoryGroup(group.CategoryGroupID)
          message.success('category Group deleted successfully')
          refetch()
        } catch {
          message.error('Failed to delete category group')
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
            <label className="mb-1 block text-sm font-bold text-slate-700">Group Name</label>
            <AppSearchInput
              placeholder="Search by group name"
              value={groupName}
              onChange={setGroupName}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Group Code</label>
            <AppSearchInput
              placeholder="Search by group code"
              value={groupCode}
              onChange={setGroupCode}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Icon</label>
            <AppSearchInput
              placeholder="Search by icon"
              value={icon}
              onChange={setIcon}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleClear}>
              Clear
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setDrawerOpen(true)}
          >
            Add New Category-Group
          </Button>
        </div>
        </div>
        <Row gutter={[16, 16]}>
          {data.map((group) => {
            return (
              <Col xs={24} sm={12} md={12} lg={8} key={group.CategoryGroupID}>
                <AppCard className="h-full" hover onClick={() => handleGroupClick(group)}>
                  <div className="mb-4 flex items-start justify-between">
                    <Typography.Title level={5} className="!mb-0 !font-semibold !text-gray-800">
                      {group.GroupName}
                    </Typography.Title>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md shrink-0"
                         style={{ backgroundColor: '#64748b' }}>
                      <span className="text-white text-lg">{getIcon(group.Icon)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">समूहको नाम:</span>
                      <span className="text-sm font-medium text-slate-800">{group.GroupName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">समूह कोड:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{group.GroupCode}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="small" 
                      style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
                      onClick={() => {
                        setDrawerGroup(group);
                        setDrawerOpen(true)
                      }}>
                        Edit
                      </Button>
                      <Button size="small" danger onClick={() => handleDelete(group)}>
                        Delete
                      </Button>
                    </div>
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
            No category groups found
          </div>
        )}
      </Spin>

      <AppDrawer
         title={drawerGroup ? 'Edit Category Group' : 'Add New Category Group'}
        subtitle={drawerGroup ? 'Update category group here' : 'Create new category group here'}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerGroup(null) }}
        width={520}
      >
        <CategoryGroupForm 
         group={drawerGroup}
        onCancel={() => setDrawerOpen(false)}
        onSuccess={() =>{
          setDrawerOpen(false)
          setDrawerGroup(null)
          refetch()
        }}
        />
      </AppDrawer>
    </div>
  )
}

export default CategoryGroup
