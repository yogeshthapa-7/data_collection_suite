import { Segmented } from 'antd'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'

interface ViewModeToggleProps {
  value: 'grid' | 'table'
  onChange: (value: 'grid' | 'table') => void
  className?: string
}

const ViewModeToggle = ({ value, onChange, className }: ViewModeToggleProps) => {
  return (
    <Segmented
      value={value}
      onChange={(val) => onChange(val as 'grid' | 'table')}
      className={className}
      options={[
        {
          value: 'grid',
          icon: <AppstoreOutlined />,
          label: 'Grid',
        },
        {
          value: 'table',
          icon: <UnorderedListOutlined />,
          label: 'Table',
        },
      ]}
    />
  )
}

export default ViewModeToggle
