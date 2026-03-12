import { NumberField } from "../ui/NumberField"
import { SectionCard } from "../ui/SectionCard"
import { SliderField } from "../ui/SliderField"
import { ToggleField } from "../ui/ToggleField"
import type { SimulationInputs } from "../../types"

type SimulationControlsProps = {
  inputs: SimulationInputs
  isRunning: boolean
  onInputChange: <K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K],
  ) => void
  onReset: () => void
  onRun: () => void
}

export function SimulationControls({
  inputs,
  isRunning,
  onInputChange,
  onReset,
  onRun,
}: SimulationControlsProps) {
  return (
    <SectionCard
      title="Simulation Controls"
      description="Adjust the parameters and run the simulation."
      className="border border-slate-200"
    >
      <div className="space-y-5">
        <SliderField
          label="Simulation Period"
          value={inputs.simulationDays}
          min={1}
          max={365}
          step={1}
          suffix="days"
          onChange={(value) => onInputChange("simulationDays", value)}
        />

        <SliderField
          label="Number of Chargepoints"
          value={inputs.chargepoints}
          min={1}
          max={200}
          step={1}
          onChange={(value) => onInputChange("chargepoints", value)}
        />

        <SliderField
          label="Arrival Probability Scale"
          value={inputs.arrivalProbabilityScale}
          min={20}
          max={200}
          step={5}
          suffix="%"
          onChange={(value) => onInputChange("arrivalProbabilityScale", value)}
        />

        <NumberField
          label="Car Consumption"
          value={inputs.carConsumptionKwhPer100Km}
          min={10}
          max={40}
          step={0.5}
          suffix="kWh / 100 km"
          onChange={(value) => onInputChange("carConsumptionKwhPer100Km", value)}
        />

        <NumberField
          label="Charging Power"
          value={inputs.chargingPowerKw}
          min={3.7}
          max={50}
          step={0.1}
          suffix="kW"
          onChange={(value) => onInputChange("chargingPowerKw", value)}
        />

        <ToggleField
          label="Use deterministic simulation"
          checked={inputs.useSeededRandomness}
          onChange={(value) => onInputChange("useSeededRandomness", value)}
        />

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isRunning ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Running simulation...
              </span>
            ) : (
              "Run simulation"
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isRunning}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </SectionCard>
  )
}