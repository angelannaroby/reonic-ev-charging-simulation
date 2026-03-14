import { Activity, BatteryCharging, Gauge, Layers3 } from 'lucide-react'

type SummaryItem = {
  label: string
  value: number | null
  unit?: string
  icon: 'energy' | 'theoretical' | 'actual' | 'concurrency'
  maximumFractionDigits?: number
}

type PageHeaderProps = {
  title: string
  summaryItems: SummaryItem[]
}

function SummaryIcon({ icon }: { icon: SummaryItem['icon'] }) {
  switch (icon) {
    case 'energy':
      return (
        <BatteryCharging className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
      )
    case 'theoretical':
      return <Gauge className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
    case 'actual':
      return <Activity className="h-3.5 w-3.5" style={{ color: 'var(--warning)' }} />
    case 'concurrency':
      return <Layers3 className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
    default:
      return null
  }
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value)
}

export function PageHeader({ title, summaryItems }: PageHeaderProps) {
  return (
    <header className="pb-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span
            className="w-fit rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wide"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            Reonic Take-Home Assignment
          </span>

          <h1
            className="text-[1.9rem] font-semibold leading-tight tracking-tight sm:text-[2.15rem]"
            style={{ color: 'var(--text)' }}
          >
            {title}
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.label}
              className={`min-w-0 ${index > 0 ? 'xl:border-l xl:pl-5' : ''}`}
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-1.5">
                <SummaryIcon icon={item.icon} />
                <p
                  className="text-[13px] font-medium leading-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.label}
                </p>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span
                  className="text-[1.25rem] font-semibold leading-none tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  {item.value === null
                    ? '—'
                    : formatNumber(item.value, item.maximumFractionDigits ?? 0)}
                </span>

                {item.value !== null && item.unit ? (
                  <span
                    className="text-[13px] font-medium leading-none"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.unit}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
