type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full border-0 bg-transparent py-2.5 text-sm font-medium text-slate-900 outline-none"
        />
        {suffix ? (
          <span className="ml-3 shrink-0 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
