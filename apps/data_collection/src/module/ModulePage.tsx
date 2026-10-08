import { memo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  DatabaseOutlined,
  ExportOutlined,
  FileTextOutlined,
  FormOutlined,
  LineChartOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import PageLayout from '@/shared/components/layout/PageLayout'

interface Feature {
  icon: ReactNode
  label: string
}

/* ------------------------------ Text column -------------------------------- */

interface CopyProps {
  eyebrow: string
  eyebrowIcon: ReactNode
  title: ReactNode
  description: string
  features: Feature[]
  buttonText: string
  onAction: () => void
}

const Copy = memo(function Copy({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  features,
  buttonText,
  onAction,
}: CopyProps) {
  return (
    <div className="flex flex-col justify-center gap-6 lg:px-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-lg text-white shadow-[0_8px_18px_-6px_rgba(79,70,229,0.7)]">
          {eyebrowIcon}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</span>
        <span className="h-px w-10 bg-indigo-200" />
      </div>

      <h2 className="m-0 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
        {title}
      </h2>

      <p className="m-0 max-w-md text-base leading-relaxed text-slate-500">{description}</p>

      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-600">
              {f.icon}
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      <div className="pt-1">
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(79,70,229,0.8)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 motion-reduce:transition-none"
        >
          {buttonText}
          <ArrowRightOutlined />
        </button>
      </div>
    </div>
  )
})

/* ------------------------------ Visual panel ------------------------------- */

interface PanelProps {
  src: string
  overlay: string
  glow: string
  eager?: boolean
  children: ReactNode
}

/** Rounded stage: photo + colour grade + ground glow, with a perspective camera. */
const Panel = memo(function Panel({ src, overlay, glow, eager = false, children }: PanelProps) {
  return (
    <div
      aria-hidden
      className="group relative min-h-[340px] overflow-hidden rounded-[2rem] shadow-[0_40px_70px_-30px_rgba(15,23,60,0.55)] [perspective:1600px] sm:min-h-[480px]"
    >
      <img
        src={src}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className={`absolute inset-0 ${glow}`} />
      {children}
    </div>
  )
})

/** A slab floating in 3D. Children with translateZ become real depth layers. */
const Stage = ({ className, children }: { className: string; children: ReactNode }) => (
  <div
    className={`absolute [transform-style:preserve-3d] [transform:rotateY(-16deg)_rotateX(7deg)_rotateZ(1deg)] transition-transform duration-700 ease-out will-change-transform group-hover:[transform:rotateY(-9deg)_rotateX(4deg)_rotateZ(0deg)] motion-reduce:transition-none ${className}`}
  >
    {children}
  </div>
)

const GroundShadow = ({ className }: { className: string }) => (
  <div
    className={`absolute rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)] ${className}`}
  />
)

/* --------------------------- Scene 1: Data Collection ---------------------- */

const SIDEBAR_ITEMS = ['Dashboard', 'Forms', 'Responses', 'Reports', 'Settings']
const LIVE_STATS: [string, string, string][] = [
  ['Total Responses', '1,248', ''],
  ['Completed', '1,102', '88%'],
  ['Pending', '146', '12%'],
]

const DataCollectionScene = memo(function DataCollectionScene() {
  return (
    <Panel
      src="/assets/images/data_collection.jpg"
      eager
      overlay="bg-gradient-to-br from-indigo-950/80 via-indigo-900/50 to-sky-400/10"
      glow="bg-[radial-gradient(60%_50%_at_50%_55%,rgba(99,102,241,0.45),transparent)]"
    >
      <GroundShadow className="bottom-[7%] left-[12%] h-10 w-[76%]" />

      <Stage className="left-[9%] top-[13%] w-[80%]">
        {/* Slab thickness */}
        <div className="absolute inset-0 rounded-[1.6rem] bg-slate-950 [transform:translate3d(14px,14px,-16px)]" />

        {/* Tablet */}
        <div className="relative rounded-[1.6rem] bg-slate-900 p-2 shadow-[0_40px_60px_-24px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          <div className="relative flex overflow-hidden rounded-[1.2rem] bg-slate-50">
            <div className="flex w-[24%] flex-col gap-2.5 bg-slate-900 p-3 text-[8px] text-slate-300 sm:text-[9px]">
              <span className="mb-1 flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500 text-[10px] text-white">
                <DatabaseOutlined />
              </span>
              {SIDEBAR_ITEMS.map((i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-slate-600" />
                  {i}
                </span>
              ))}
            </div>

            <div className="flex-1 p-3">
              <p className="m-0 text-[10px] font-bold text-slate-800 sm:text-[11px]">Data Collection Portal</p>
              <p className="m-0 mb-2 text-[7px] text-slate-400 sm:text-[8px]">Create, manage and monitor your forms</p>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <p className="m-0 mb-1.5 text-[8px] font-semibold text-slate-700">Create New Form</p>
                  <p className="m-0 text-[6px] text-slate-400">Form Name</p>
                  <div className="mb-1.5 rounded border border-slate-200 px-1.5 py-1 text-[7px] text-slate-600">
                    Household Survey 2025
                  </div>
                  <p className="m-0 text-[6px] text-slate-400">Form Type</p>
                  <div className="mb-2 rounded border border-slate-200 px-1.5 py-1 text-[7px] text-slate-600">Survey</div>
                  <div className="rounded bg-blue-600 py-1 text-center text-[7px] font-semibold text-white">
                    Create Form
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="m-0 text-[8px] font-semibold text-slate-700">Recent Responses</p>
                  {LIVE_STATS.map(([label, value, pct]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 shadow-sm"
                    >
                      <div>
                        <p className="m-0 text-[6px] text-slate-400">{label}</p>
                        <p className="m-0 text-[10px] font-bold text-slate-800">{value}</p>
                      </div>
                      {pct && (
                        <span className="rounded bg-emerald-50 px-1 text-[6px] font-semibold text-emerald-600">
                          {pct}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glass glare */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent" />
          </div>
        </div>

        {/* Depth layer: icon tile */}
        <span className="absolute -right-4 -top-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 text-2xl text-white shadow-[0_24px_36px_-12px_rgba(30,64,175,0.8)] [transform:translateZ(90px)]">
          <FileTextOutlined />
        </span>

        {/* Depth layer: donut card */}
        <div className="absolute -bottom-8 -left-8 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_30px_44px_-14px_rgba(15,23,60,0.6)] [transform:translateZ(70px)] sm:flex">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'conic-gradient(#4F46E5 0 88%, #22C55E 88% 100%)' }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-800">
              88%
            </span>
          </div>
          <div>
            <p className="m-0 text-xs font-bold text-slate-800">Responses</p>
            <p className="m-0 text-xs text-slate-500">Completed</p>
            <p className="m-0 text-[11px] font-semibold text-emerald-500">↑ 12%</p>
          </div>
        </div>
      </Stage>
    </Panel>
  )
})

/* ------------------------- Scene 2: Project Management --------------------- */

const STATS = [
  { value: '12', label: 'Total Projects', tone: 'bg-blue-50 text-blue-600' },
  { value: '6', label: 'In Progress', tone: 'bg-teal-50 text-teal-600' },
  { value: '4', label: 'Completed', tone: 'bg-emerald-50 text-emerald-600' },
  { value: '2', label: 'On Hold', tone: 'bg-rose-50 text-rose-500' },
]

const ROWS = [
  { name: 'Website Redesign', status: 'In Progress', chip: 'bg-blue-100 text-blue-600', bar: 'bg-blue-500', p: 60 },
  { name: 'Mobile App Development', status: 'Not Started', chip: 'bg-rose-100 text-rose-500', bar: 'bg-slate-300', p: 0 },
  { name: 'Office Renovation', status: 'Completed', chip: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500', p: 100 },
  { name: 'Marketing Campaign', status: 'In Progress', chip: 'bg-blue-100 text-blue-600', bar: 'bg-blue-500', p: 45 },
]

const ProjectScene = memo(function ProjectScene() {
  return (
    <Panel
      src="/assets/images/project_management.png"
      overlay="bg-gradient-to-br from-[#050B1E]/90 via-[#0B1730]/80 to-[#12306B]/60"
      glow="bg-[radial-gradient(60%_50%_at_50%_55%,rgba(59,130,246,0.4),transparent)]"
    >
      <GroundShadow className="bottom-[9%] left-[8%] h-10 w-[84%]" />

      <Stage className="left-[7%] top-[11%] w-[86%] [transform-origin:50%_100%]">
        {/* Lid */}
        <div className="relative rounded-t-[1.1rem] bg-slate-900 px-2 pb-2 pt-3 shadow-[0_30px_50px_-22px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          <span className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-slate-600" />
          <div className="relative flex overflow-hidden rounded-md bg-slate-50">
            <div className="flex w-[22%] flex-col gap-2 bg-[#0F1F44] p-3 text-[8px] text-slate-300 sm:text-[9px]">
              <span className="mb-1 text-[9px] font-bold text-white">ProManage</span>
              {['Dashboard', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Departments'].map((i, idx) => (
                <span key={i} className={`rounded px-1.5 py-1 ${idx === 1 ? 'bg-blue-500/30 text-white' : ''}`}>
                  {i}
                </span>
              ))}
            </div>

            <div className="flex-1 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="m-0 text-[10px] font-bold text-slate-800 sm:text-[11px]">My Projects</p>
                <span className="rounded bg-blue-600 px-1.5 py-1 text-[7px] font-semibold text-white">
                  + New Project
                </span>
              </div>

              <div className="mb-2 grid grid-cols-4 gap-1.5">
                {STATS.map((s) => (
                  <div key={s.label} className={`rounded-lg px-1.5 py-1.5 ${s.tone}`}>
                    <p className="m-0 text-[12px] font-bold leading-none">{s.value}</p>
                    <p className="m-0 mt-0.5 text-[6px]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-white p-2 shadow-sm">
                {ROWS.map((r) => (
                  <div key={r.name} className="flex items-center gap-2 border-b border-slate-100 py-1.5 last:border-0">
                    <span className="w-[36%] truncate text-[7px] font-medium text-slate-700">{r.name}</span>
                    <span className={`w-[24%] rounded px-1 py-0.5 text-center text-[6px] font-semibold ${r.chip}`}>
                      {r.status}
                    </span>
                    <span className="h-1 flex-1 rounded-full bg-slate-100">
                      <span className={`block h-1 rounded-full ${r.bar}`} style={{ width: `${r.p}%` }} />
                    </span>
                    <span className="w-5 text-right text-[6px] text-slate-400">{r.p}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent" />
          </div>
        </div>

        {/* Keyboard deck */}
        <div className="relative -left-[4%] h-3.5 w-[108%] rounded-b-[1.2rem] bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 shadow-[0_20px_30px_-10px_rgba(0,0,0,0.7)]">
          <span className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b bg-slate-500/70" />
        </div>

        {/* Depth layer: deadline card */}
        <div className="absolute -bottom-10 -left-6 hidden w-[46%] rounded-2xl bg-white p-3 shadow-[0_30px_44px_-14px_rgba(0,0,0,0.7)] [transform:translateZ(80px)] sm:block">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-base text-indigo-600">
              <CalendarOutlined />
            </span>
            <div>
              <p className="m-0 text-xs font-bold text-slate-800">On Track</p>
              <p className="m-0 text-[10px] text-slate-500">Project deadline: 12 Apr 2025</p>
            </div>
          </div>
          <span className="mt-2.5 block h-1.5 rounded-full bg-slate-100">
            <span className="block h-1.5 w-2/5 rounded-full bg-emerald-500" />
          </span>
        </div>
      </Stage>
    </Panel>
  )
})

/* ---------------------------------- Page ----------------------------------- */

const DATA_FEATURES: Feature[] = [
  { icon: <FormOutlined />, label: 'Dynamic form builder' },
  { icon: <LineChartOutlined />, label: 'Real-time response tracking' },
  { icon: <SafetyCertificateOutlined />, label: 'Data validation & monitoring' },
  { icon: <ExportOutlined />, label: 'Export & reporting' },
]

const PROJECT_FEATURES: Feature[] = [
  { icon: <ProjectOutlined />, label: 'Project planning & scheduling' },
  { icon: <CheckSquareOutlined />, label: 'Task & subtask management' },
  { icon: <TeamOutlined />, label: 'Team collaboration' },
  { icon: <ApartmentOutlined />, label: 'Departments & branches' },
  { icon: <BarChartOutlined />, label: 'Analytics & reports' },
]

const ModulePage = () => {
  const navigate = useNavigate()

  return (
    <PageLayout showNavigation={false} showHeader={false}>
      {/* Data Collection — full width row */}
      <section aria-label="Data Collection" className="w-full grid md:grid-cols-2 items-center">
        <DataCollectionScene />
        <div className="flex items-center justify-center">
          <Copy
            eyebrow="Data Collection"
            eyebrowIcon={<FileTextOutlined />}
            title={
              <>
                Collect Better Data.
                <br />
                <span className="text-blue-600">Build a Smarter Future.</span>
              </>
            }
            description="Create and manage dynamic forms and question sets, deploy them in the field, collect responses, and turn data into meaningful insights."
            features={DATA_FEATURES}
            buttonText="Explore Data Collection"
            onAction={() => navigate('/category')}
          />
        </div>
      </section>

      {/* Project Management — full width row, reversed */}
      <section aria-label="Project Management" className="w-full grid md:grid-cols-2 items-center">
        <div className="flex items-center justify-center md:order-1">
          <Copy
            eyebrow="Project Management"
            eyebrowIcon={<ProjectOutlined />}
            title={
              <>
                Plan. Track. <span className="text-blue-600">Deliver.</span>
              </>
            }
            description="Keep your projects on track with powerful tools for planning, collaboration, and progress monitoring."
            features={PROJECT_FEATURES}
            buttonText="Explore Projects"
            onAction={() => {
              window.location.href = 'https://projectmanagement.himalayankasturi.com.np/'
            }}
          />
        </div>
        <div className="md:order-2">
          <ProjectScene />
        </div>
      </section>
    </PageLayout>
  )
}

export default ModulePage