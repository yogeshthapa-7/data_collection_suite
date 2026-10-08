// components/Card.tsx
import React from 'react';
import { Card as AntCard, Tag, Typography } from 'antd';

const { Text, Title } = Typography;

export interface CardDetail {
  label: string;
  value: React.ReactNode;
}

export interface CardProps {
  title: string;
  subtitle?: string;
  icon?: string;                 // Font Awesome class (e.g. "fa fa-road")
  iconColor?: string;            // background color of the icon circle
  orderKey?: number | string;
  details?: CardDetail[];
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;    // optional extra content
  action?: React.ReactNode;      // top-right action area
  disableHoverScale?: boolean;   // disable hover lift/scale for this card
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  iconColor = '#64748b',
  orderKey,
  details = [],
  onClick,
  className = '',
  children,
  action,
  disableHoverScale = false,
}) => {
  const hoverScaleClasses = disableHoverScale
    ? ''
    : 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgb(0,0,0,0.1),0_4px_12px_rgb(0,0,0,0.05)]'

  return (
    <AntCard
      hoverable={!!onClick}
      onClick={onClick}
      className={`
        relative overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200
        shadow-[0_8px_30px_rgb(0,0,0,0.08),0_4px_12px_rgb(0,0,0,0.04)]
        ${hoverScaleClasses}
        ${className}
      `}
      styles={{
        body: {
          padding: '20px 22px',
        },
      }}
    >
      {/* Soft top highlight for 3D effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/70 to-transparent" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md shrink-0"
              style={{ backgroundColor: iconColor }}
            >
              <i className={`${icon} text-white text-lg`} />
            </div>
          )}

          <div>
            <Title level={5} className="!mb-0 !text-gray-800 !font-semibold">
              {title}
            </Title>
            {subtitle && (
              <Text type="secondary" className="text-xs">
                {subtitle}
              </Text>
            )}
          </div>
        </div>

        {orderKey !== undefined && !action && (
          <Tag className="!m-0 !rounded-lg !border-0 !bg-gray-800 !text-white !px-2.5">
            #{orderKey}
          </Tag>
        )}
        {action}
      </div>

      {/* Details */}
      {details.length > 0 && (
        <div className="relative z-10 space-y-2.5">
          {details.map((item, index) => (
            <div key={index} className="flex justify-between text-sm items-center gap-3">
              <Text type="secondary" className="shrink-0">
                {item.label}
              </Text>
              <div className="text-right font-medium text-gray-700 truncate">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional children */}
      {children && <div className="relative z-10 mt-4">{children}</div>}
    </AntCard>
  );
};

export default Card;