// components/Button.tsx
import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps extends AntButtonProps {
  // You can add extra custom props here if needed later
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  size = 'middle',
  ...rest
}) => {
  return (
    <AntButton
      type={type}
      size={size}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

export default Button;