// components/Input.tsx
import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps } from 'antd';

export interface InputProps extends AntInputProps {
  // You can add extra custom props here if needed later
}

const Input: React.FC<InputProps> = ({
  ...rest
}) => {
  return <AntInput {...rest} />;
};

export default Input;
