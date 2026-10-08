import React from 'react'
import { Card } from 'antd'

interface ModuleCardProps {
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  buttonText: string
  onAction: () => void
  accentColor: string
  bulletPoints: string[]
}

const ModuleCard = ({
  title,
  subtitle,
  description,
  icon,
  buttonText,
  onAction,
  accentColor,
  bulletPoints,
}: ModuleCardProps) => {
  return (
    <Card
      bordered={false}
      className="
        h-full overflow-hidden
        !bg-gradient-to-br !from-slate-50 !to-white
        !shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)]
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
      "
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex h-full flex-col">
        {/* Icon and Title */}
        <div className="p-8 lg:p-10">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {subtitle}
              </span>
              <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
            </div>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            {description}
          </p>

          {/* Bullet Points */}
          <div className="mb-8 grid grid-cols-1 gap-y-2.5 sm:grid-cols-2">
            {bulletPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <span
                  className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 p-0.5">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </span>
                <span className="text-[13px] font-medium text-slate-600">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto p-8 pt-0 lg:p-10 lg:pt-0">
          <button
            onClick={onAction}
            className="
              w-max rounded-full px-6 py-2.5
              text-sm font-semibold text-white
              transition-all duration-200
              hover:scale-105
              hover:shadow-lg
            "
            style={{
              background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 4px 15px -3px ${accentColor}40`,
            }}
          >
            {buttonText} →
          </button>
        </div>
      </div>
    </Card>
  )
}

export default ModuleCard
