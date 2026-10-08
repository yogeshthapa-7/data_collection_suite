import React from 'react';
import { Menu, ConfigProvider, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClusterOutlined,
  BankOutlined,
  FormOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  ApartmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '/category', icon: <AppstoreOutlined />, label: 'Category' },
  { key: '/category-group', icon: <ClusterOutlined />, label: 'Category-Group' },
  {
    key: '/organization-group',
    icon: <BankOutlined />,
    label: 'Organization-Group'
  },
  { key: '/form-data', icon: <FormOutlined />, label: 'Form Data' },
  { key: '/map-view', icon: <EnvironmentOutlined />, label: 'Map View' },
  {
    key: '/users',
    icon: <TeamOutlined />,
    label: 'Users'
  },
  {
    key: '/employee',
    icon: <UserOutlined />,
    label: 'Employee'
  },
  {
    key: '/departments',
    icon: <ApartmentOutlined />,
    label: 'Departments'
  },
  {
    key: '/mapbox-resource',
    icon: <GlobalOutlined />,
    label: 'Mapbox Resource'
  },
];

const NavigationMenu: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 16,
          colorPrimary: '#4f46e5',
        },
      }}
    >
      <div className="sticky top-[72px] z-50 border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
  <div className="mx-auto max-w-7xl px-4">
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={onClick}
      items={items}
      className="
        !bg-transparent !border-none !min-h-[56px]
        !flex !items-center
        [&_.ant-menu-item]:!mx-1
        [&_.ant-menu-item]:!rounded-xl
        [&_.ant-menu-item]:!px-4
        [&_.ant-menu-item]:!h-10
        [&_.ant-menu-item]:!leading-10
        [&_.ant-menu-item]:!text-indigo-100/80
        [&_.ant-menu-item]:!font-medium
        [&_.ant-menu-item]:!transition-all
        [&_.ant-menu-item]:!duration-200
        [&_.ant-menu-item:hover]:!bg-white/10
        [&_.ant-menu-item:hover]:!text-white
        [&_.ant-menu-item:hover]:!shadow-md
        [&_.ant-menu-item:hover]:!-translate-y-0.5
        [&_.ant-menu-item-selected]:!bg-indigo-500/90
        [&_.ant-menu-item-selected]:!text-white
        [&_.ant-menu-item-selected]:!shadow-lg
        [&_.ant-menu-item-selected]:!shadow-indigo-500/40
        [&_.ant-menu-item-selected]:!ring-1
        [&_.ant-menu-item-selected]:!ring-white/20
        [&_.ant-menu-item-selected]:!-translate-y-0.5
        [&_.ant-menu-submenu-title]:!text-indigo-100/80
        [&_.ant-menu-submenu-title:hover]:!text-white
        [&_.ant-menu-submenu-title]:!font-medium
        [&_.ant-menu-submenu]:!text-indigo-100/80
      "
    />
  </div>
</div>
    </ConfigProvider>
  );
};

export default NavigationMenu;
