import { memo, forwardRef } from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<AntButtonProps, 'size' | 'variant'> {
  variant?: ButtonVariant;
  size?: ButtonSize | AntButtonProps['size'];
}

const variantStyles: Record<ButtonVariant, Pick<AntButtonProps, 'type' | 'shape'>> = {
  primary: {},
  ghost: { type: 'text' },
  outline: { type: 'default' },
  icon: { type: 'text', shape: 'circle' },
};

const sizeStyles: Record<string, Pick<AntButtonProps, 'size'>> = {
  sm: { size: 'small' },
  md: {},
  lg: { size: 'large' },
  small: { size: 'small' },
  middle: { size: 'middle' },
  large: { size: 'large' },
};

export const Button = memo(
  forwardRef<HTMLElement, ButtonProps>(function Button(
    {
      variant = 'primary',
      size = 'md',
      className = '',
      icon,
      children,
      ...rest
    },
    ref
  ) {
    const variantStyle = variantStyles[variant] ?? {};
    const sizeStyle = sizeStyles[size as string] ?? {};

    return (
      <AntButton
        ref={ref as any}
        {...variantStyle}
        {...sizeStyle}
        {...(icon ? { icon } : {})}
        {...rest}
        className={className}
      >
        {children}
      </AntButton>
    );
  })
);

export default Button;