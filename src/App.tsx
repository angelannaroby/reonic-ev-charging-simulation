import { useMemo, useState } from "react"

import { PageHeader } from "./components/layout/PageHeader"
import { SimulationControls } from "./components/layout/SimulationControls"
import { SectionCard } from "./components/ui/SectionCard"
import { defaultSimulationInputs } from "./data/defaultSimulationInputs"
import { runSimulation } from "./lib/simulation"
import type { SimulationInputs, SummaryMetric } from "./types"

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value)
}

function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(defaultSimulationInputs)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(() => runSimulation(defaultSimulationInputs))

  const summaryItems = useMemo<SummaryMetric[]>(
    () => [
      {
        label: "Total Energy",
        value: formatNumber(result.totalEnergyKwh),
        unit: "kWh",
        icon: "energy",
      },
      {
        label: "Theoretical Peak",
        value: formatNumber(result.theoreticalPeakKw, 1),
        unit: "kW",
        icon: "theoretical",
      },
      {
        label: "Actual Peak",
        value: formatNumber(result.actualPeakKw, 1),
        unit: "kW",
        icon: "actual",
      },
      {
        label: "Concurrency Factor",
        value: formatNumber(result.concurrencyFactor * 100, 1),
        unit: "%",
        icon: "concurrency",
      },
    ],
    [result],
  )

  function updateInput<K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K],
  ) {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleReset() {
    setInputs(defaultSimulationInputs)
  }

  function handleRunSimulation() {
    setIsRunning(true)

    window.setTimeout(() => {
      setResult(runSimulation(inputs))
      setIsRunning(false)
    }, 800)
  }

  return (
    <main className="min-h-screen bg-white px-4 py-3 sm:px-5 sm:py-5 lg:px-6 xl:px-8">
      <div className="flex min-h-screen flex-col gap-5">
        <PageHeader
          title="EV Charging Demand Simulator"
          summaryItems={summaryItems}
        />

        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <SimulationControls
              inputs={inputs}
              isRunning={isRunning}
              onInputChange={updateInput}
              onReset={handleReset}
              onRun={handleRunSimulation}
            />
          </aside>

          <div className="flex min-w-0 flex-col gap-5">
            <SectionCard
              title="Charging Load Over Time"
              description="Main chart area for the simulated load profile."
              className="border border-slate-200"
            >
              <div
                className={`flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 transition lg:h-[440px] ${
                  isRunning ? "animate-pulse" : ""
                }`}
              >
                {isRunning
                  ? "Updating chart..."
                  : `${result.loadProfile.length} load points generated`}
              </div>
            </SectionCard>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.2fr)_360px]">
              <SectionCard
                title="Exemplary Day Profile"
                description="24-hour view of charging behaviour."
                className="border border-slate-200"
              >
                <div
                  className={`flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 transition ${
                    isRunning ? "animate-pulse" : ""
                  }`}
                >
                  {isRunning
                    ? "Refreshing day profile..."
                    : `${result.exemplaryDayProfile.length} day profile points generated`}
                </div>
              </SectionCard>

              <SectionCard
                title="Charging Events"
                description="Projected event frequency based on the simulated period."
                className="border border-slate-200"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-2xl bg-slate-50 px-4 py-3 ${isRunning ? "animate-pulse" : ""}`}>
                    <p className="text-sm text-slate-500">Per year</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {formatNumber(result.chargingEvents.perYear)}
                    </p>
                  </div>

                  <div className={`rounded-2xl bg-slate-50 px-4 py-3 ${isRunning ? "animate-pulse" : ""}`}>
                    <p className="text-sm text-slate-500">Per month</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {formatNumber(result.chargingEvents.perMonth)}
                    </p>
                  </div>

                  <div className={`rounded-2xl bg-slate-50 px-4 py-3 ${isRunning ? "animate-pulse" : ""}`}>
                    <p className="text-sm text-slate-500">Per week</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {formatNumber(result.chargingEvents.perWeek)}
                    </p>
                  </div>

                  <div className={`rounded-2xl bg-slate-50 px-4 py-3 ${isRunning ? "animate-pulse" : ""}`}>
                    <p className="text-sm text-slate-500">Per day</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {formatNumber(result.chargingEvents.perDay, 1)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App