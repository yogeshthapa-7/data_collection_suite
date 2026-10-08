// components/Dropdown.tsx
import React from 'react';
import { Dropdown as AntDropdown } from 'antd';
import type { DropdownProps as AntDropdownProps } from 'antd';

export interface DropdownProps extends AntDropdownProps {
  // You can add extra custom props here if needed later
}

const Dropdown: React.FC<DropdownProps> = ({
  ...rest
}) => {
  return <AntDropdown {...rest} />;
};

export default Dropdown;
