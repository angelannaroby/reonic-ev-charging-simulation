import { useEffect, useMemo, useRef, useState } from "react";

import { DayProfileChart } from "./components/charts/DayProfileChart";
import { LoadProfileChart } from "./components/charts/LoadProfileChart";
import { PageHeader } from "./components/layout/PageHeader";
import { SimulationControls } from "./components/layout/SimulationControls";
import { SectionCard } from "./components/ui/SectionCard";
import { defaultSimulationInputs } from "./data/defaultSimulationInputs";
import { buildExemplaryDayProfile, buildLoadProfileChartData } from "./lib/chartData";
import { runSimulation } from "./lib/simulation";
import type {
  SimulationInputs,
  SimulationResult,
  SummaryMetric,
} from "./types";

type SummaryValues = {
  totalEnergyKwh: number;
  theoreticalPeakKw: number;
  actualPeakKw: number;
  concurrencyPercent: number;
};

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function getSummaryValues(result: SimulationResult): SummaryValues {
  return {
    totalEnergyKwh: result.totalEnergyKwh,
    theoreticalPeakKw: result.theoreticalPeakKw,
    actualPeakKw: result.actualPeakKw,
    concurrencyPercent: result.concurrencyFactor * 100,
  };
}

function App() {
  const initialResult = useMemo(
    () => runSimulation(defaultSimulationInputs),
    [],
  );

  const [inputs, setInputs] = useState<SimulationInputs>(
    defaultSimulationInputs,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState<SimulationResult>(initialResult);
  const [displaySummary, setDisplaySummary] = useState<SummaryValues>(
    getSummaryValues(initialResult),
  );

  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const summaryItems = useMemo<SummaryMetric[]>(
    () => [
      {
        label: "Total Energy Consumed",
        value: displaySummary.totalEnergyKwh,
        unit: "kWh",
        icon: "energy",
        maximumFractionDigits: 0,
      },
      {
        label: "Theoretical Max Power Demand",
        value: displaySummary.theoreticalPeakKw,
        unit: "kW",
        icon: "theoretical",
        maximumFractionDigits: 1,
      },
      {
        label: "Actual Max Power Demand",
        value: displaySummary.actualPeakKw,
        unit: "kW",
        icon: "actual",
        maximumFractionDigits: 1,
      },
      {
        label: "Concurrency Factor",
        value: displaySummary.concurrencyPercent,
        unit: "%",
        icon: "concurrency",
        maximumFractionDigits: 1,
      },
    ],
    [displaySummary],
  );

  const loadChartData = useMemo(
    () => buildLoadProfileChartData(result.loadProfile, 120),
    [result.loadProfile],
  );

  const dayChartData = useMemo(
    () => buildExemplaryDayProfile(result.loadProfile),
    [result.loadProfile],
  );

  function updateInput<K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K],
  ) {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function animateSummaryTo(
    start: SummaryValues,
    end: SummaryValues,
    duration = 900,
    onComplete?: () => void,
  ) {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplaySummary({
        totalEnergyKwh:
          start.totalEnergyKwh +
          (end.totalEnergyKwh - start.totalEnergyKwh) * eased,
        theoreticalPeakKw:
          start.theoreticalPeakKw +
          (end.theoreticalPeakKw - start.theoreticalPeakKw) * eased,
        actualPeakKw:
          start.actualPeakKw + (end.actualPeakKw - start.actualPeakKw) * eased,
        concurrencyPercent:
          start.concurrencyPercent +
          (end.concurrencyPercent - start.concurrencyPercent) * eased,
      });

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        setDisplaySummary(end);
        animationFrameRef.current = null;
        onComplete?.();
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }

  function handleReset() {
    const nextResult = runSimulation(defaultSimulationInputs);

    setInputs(defaultSimulationInputs);
    setResult(nextResult);
    setDisplaySummary(getSummaryValues(nextResult));
    setRefreshKey((current) => current + 1);
  }

  function handleRunSimulation() {
    setIsRunning(true);

    const nextResult = runSimulation(inputs);
    const startSummary = displaySummary;
    const endSummary = getSummaryValues(nextResult);

    animateSummaryTo(startSummary, endSummary, 950, () => {
      setResult(nextResult);
      setRefreshKey((current) => current + 1);
      setIsRunning(false);
    });
  }

  const eventItems = [
    { label: "Per year", value: formatNumber(result.chargingEvents.perYear) },
    { label: "Per month", value: formatNumber(result.chargingEvents.perMonth) },
    { label: "Per week", value: formatNumber(result.chargingEvents.perWeek) },
    { label: "Per day", value: formatNumber(result.chargingEvents.perDay, 1) },
  ];

  return (
    <main
      className="min-h-screen px-4 py-3 sm:px-5 sm:py-5 lg:px-6 xl:px-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
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
              title="Charging Load Over the Simulation Period"
              description="Power usage of all charging stations over the simulation period."
              action={
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--warning-soft)",
                    color: "var(--warning)",
                  }}
                >
                  Peak {formatNumber(result.actualPeakKw, 1)} kW
                </span>
              }
            >
              <div
                key={`load-${refreshKey}`}
                className={`transition-opacity duration-200 ${
                  isRunning ? "opacity-50" : "chart-reveal"
                }`}
              >
                <LoadProfileChart data={loadChartData} />
              </div>
            </SectionCard>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.2fr)_360px]">
              <SectionCard
                title="Exemplary Day Profile"
                description="Charging power usage during a typical day"
                action={
                  <span
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    24h view
                  </span>
                }
              >
                <div
                  key={`day-${refreshKey}`}
                  className={`transition-opacity duration-200 ${
                    isRunning ? "opacity-50" : "chart-reveal"
                  }`}
                >
                  <DayProfileChart data={dayChartData} />
                </div>
              </SectionCard>

              <SectionCard
                title="Charging Events"
                description="Projected event frequency based on the simulated period."
                action={
                  <span
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--success-soft)",
                      color: "var(--success)",
                    }}
                  >
                    {formatNumber(result.totalChargingEvents)} sessions
                  </span>
                }
              >
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {eventItems.map((item) => (
                    <div
                      key={`${item.label}-${refreshKey}`}
                      className="metric-reveal rounded-2xl border px-4 py-3"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="mt-1.5 text-lg font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
