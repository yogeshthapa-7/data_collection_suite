import { useState, useEffect } from 'react'
import { Row, Col, Spin, message, Typography } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchOrganizations } from '@/features/pages/organization/services/organization.service'
import type { OrganizationItem } from '@/features/pages/organization/types/organization'
// import Card from '@/shared/components/ui/card'
import { Button } from '@data-collection-suite/ui'
import InputCustom from '@/shared/components/ui/input'
import { AppCard } from '@data-collection-suite/ui'

const Organization = () => {
  const [data, setData] = useState<OrganizationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const fetchData = async (page: number = 1, pageSize: number = 10, search: string = '') => {
    setLoading(true)
    try {
      const response = await fetchOrganizations(page, pageSize, search)
      setData(response.data || [])
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Unknown error'
      message.error(`Failed to fetch organizations: ${msg}`)
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    fetchData(1, 10, searchText)
  }

  const handleReset = () => {
    setSearchText('')
    fetchData(1, 10, '')
  }

  const handleOrgClick = (_org: OrganizationItem) => {
    message.info('Organization card clicked')
  }

  return (
    <div className="p-6">
      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Organization Name</label>
            <InputCustom
              placeholder="Search organizations..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Clear</Button>
          </div>
        </div>
        </div>
        <Row gutter={[16, 16]}>
                    {data.map((org) => (
            <Col xs={24} sm={12} md={12} lg={8} key={org.OrganizationID}>
                <AppCard className="h-full" hover onClick={() => handleOrgClick(org)}>
                <Typography.Title
                  level={5}
                  className="!mb-2 !text-lg !font-bold !text-gray-800"
                >
                  {org.Title}
                </Typography.Title>

                <div className="border-t border-slate-300" />

                <div className="flex items-center justify-between py-3">
                  <Typography.Text type="secondary" className="text-sm">
                    Parent Organization Name
                  </Typography.Text>
                  <span className="text-sm font-medium text-gray-800">
                    {org.ParentOrganizationName || 'None'}
                  </span>
                </div>

                <div className="border-t border-slate-300" />

                <div className="flex justify-end gap-2 pt-3">
                  <Button size="small" style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}>
                    Edit
                  </Button>
                  <Button size="small" danger>
                    Delete
                  </Button>
                </div>
              </AppCard>
            </Col>
          ))}
        </Row>

        {!loading && data.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No organizations found
          </div>
        )}
      </Spin>
    </div>
  )
}

export default Organization
