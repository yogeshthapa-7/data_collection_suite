import { useState, useEffect } from 'react'
import { Row, Col, Spin, message, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchOrganizations } from '@/features/pages/organization/services/organization.service'
import type { OrganizationItem } from '@/features/pages/organization/types/organization'
import { AppCard, AppSearchInput, Button, AppPagination } from '@data-collection-suite/ui'
import { AppDrawer } from '@data-collection-suite/ui';
import { usePaginatedList } from '@data-collection-suite/hooks'
import OrganizationForm from './OrganizationForm';

const Organization = () => {
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerOrg, setDrawerOrg] = useState<OrganizationItem | null>(null)

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
  } = usePaginatedList<OrganizationItem>({
    fetcher: ({ start, length }) =>
      fetchOrganizations(start / length + 1, length, appliedSearch).then((r) => ({
        items: r.data || [],
        total: r.recordsFiltered ?? r.recordsTotal ?? 0,
      })),
    extraDeps: [appliedSearch],
  })

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const handleSearch = () => {
    setAppliedSearch(searchInput)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchInput('')
    setAppliedSearch('')
    setCurrentPage(1)
  }

  const handleOrgClick = (org: OrganizationItem) => {
    message.info(`Organization selected: ${org.Title}`)
  }

  return (
    <div className="p-6">
      <Spin spinning={loading}>
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-bold text-slate-700">Organization Name</label>
            <AppSearchInput
              placeholder="Search organizations..."
              value={searchInput}
              onChange={setSearchInput}
              onPressEnter={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Clear</Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setDrawerOpen(true)}
          >
            Add New Organization
          </Button>
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
                    {org.ParentOrganizationName || ' '}
                  </span>
                </div>

                <div className="border-t border-slate-300" />

                <div className="flex justify-end gap-2 pt-3">
                  <Button size="small" 
                  style={{ backgroundColor: '#389e0d', borderColor: '#389e0d', color: 'white' }}
                  onCLick={() => {
                    setDrawerOrg(org)
                    setDrawerOpen(true)
                  }}>
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

        <AppPagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />

        {!loading && data.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No organizations found
          </div>
        )}
      </Spin>
      <AppDrawer
        title={drawerOrg ? 'Edit Organization' : 'Add New Organization'}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setDrawerOrg(null)
        }}
        width={600}
      >
        <OrganizationForm 
        org={drawerOrg}
        onCancel={() => {
          setDrawerOpen(false)
          setDrawerOrg(null)
        }}
        onSuccess={() => {
          setDrawerOpen(false)
          setDrawerOrg(null)
          refetch()
        }}
        />
      </AppDrawer>
    </div>
  )
}

export default Organization
