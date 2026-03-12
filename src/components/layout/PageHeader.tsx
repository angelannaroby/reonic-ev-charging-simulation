import { Activity, BatteryCharging, Gauge, Layers3 } from "lucide-react"

type SummaryItem = {
  label: string
  value: string
  unit?: string
  icon: "energy" | "theoretical" | "actual" | "concurrency"
}

type PageHeaderProps = {
  title: string
  summaryItems: SummaryItem[]
}

function SummaryIcon({ icon }: { icon: SummaryItem["icon"] }) {
  switch (icon) {
    case "energy":
      return <BatteryCharging className="h-3.5 w-3.5" />
    case "theoretical":
      return <Gauge className="h-3.5 w-3.5" />
    case "actual":
      return <Activity className="h-3.5 w-3.5" />
    case "concurrency":
      return <Layers3 className="h-3.5 w-3.5" />
    default:
      return null
  }
}

export function PageHeader({ title, summaryItems }: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
            Reonic Take-Home Assignment
          </span>

          <h1 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[2.15rem]">
            {title}
          </h1>
        </div>

        <div className="grid gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.label}
              className={`min-w-0 xl:px-2 ${
                index > 0 ? "xl:border-l xl:border-slate-200 xl:pl-5" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 text-slate-500">
                <SummaryIcon icon={item.icon} />
                <p className="text-[13px] font-medium leading-none">{item.label}</p>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-[1.25rem] font-semibold leading-none tracking-tight text-slate-950">
                  {item.value}
                </span>
                {item.unit ? (
                  <span className="text-[13px] font-medium leading-none text-slate-500">
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