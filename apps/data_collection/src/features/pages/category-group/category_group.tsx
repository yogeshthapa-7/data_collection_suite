import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Row, Col, Spin, message, Typography } from 'antd'
import { SearchOutlined, HomeOutlined, CarryOutOutlined, HeartOutlined, ToolOutlined, BookOutlined, PhoneOutlined, ApartmentOutlined, ShoppingOutlined } from '@ant-design/icons'
import { fetchCategoryGroups } from '@/features/pages/category-group/services/category-group.service'
import type {
  // CategoryGroupServerSearchRequest,
  CategoryGroupItem,
} from '@/features/pages/category-group/types/category-type'
// import Card from '@/shared/components/ui/card'
import { Button } from '@data-collection-suite/ui'
import InputCustom from '@/shared/components/ui/input'
import { AppCard } from '@data-collection-suite/ui'

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
  const [groups, setGroups] = useState<CategoryGroupItem[]>([])
  const [loading, setLoading] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupCode, setGroupCode] = useState('')
  const [icon, setIcon] = useState('')

  const getIcon = (icon?: string) => {
    if (!icon) return <HomeOutlined />
    return iconMap[icon] || <HomeOutlined />
  }

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const response = await fetchCategoryGroups(1, 10, '')
      setGroups(response.data || [])
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Unknown error'
      message.error(`Failed to fetch category groups: ${msg}`)
      console.error('Failed to fetch category groups:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleFilterChange = () => {
    fetchGroups()
  }

  return (
    <div className="p-6">

      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Group Name</label>
            <InputCustom
              placeholder="Search by group name"
              value={groupName}
              onChange={(e) => { setGroupName(e.target.value); handleFilterChange() }}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Group Code</label>
            <InputCustom
              placeholder="Search by group code"
              value={groupCode}
              onChange={(e) => { setGroupCode(e.target.value); handleFilterChange() }}
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Icon</label>
            <InputCustom
              placeholder="Search by icon"
              value={icon}
              onChange={(e) => { setIcon(e.target.value); handleFilterChange() }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilterChange}>
              Search
            </Button>
            <Button onClick={() => { setGroupName(''); setGroupCode(''); setIcon(''); setTimeout(handleFilterChange, 0) }}>
              Clear
            </Button>
          </div>
        </div>
        </div>
        <Row gutter={[16, 16]}>
          {groups.map((group) => {
            return (
              <Col xs={24} sm={12} md={12} lg={8} key={group.CategoryGroupID}>
                <AppCard className="h-full" hover onCLick={() => handleGroupClick(group)}>
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
                      <Button size="small" style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}>
                        Edit
                      </Button>
                      <Button size="small" danger>
                        Delete
                      </Button>
                    </div>
                  </div>
                </AppCard>
              </Col>
            )
          })}
        </Row>

        {!loading && groups.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No category groups found
          </div>
        )}
      </Spin>
    </div>
  )
}

export default CategoryGroup
