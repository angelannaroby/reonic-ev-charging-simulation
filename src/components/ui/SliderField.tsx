type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: SliderFieldProps) {
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="min-w-[72px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-right text-sm font-medium text-slate-900">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider"
        style={
          {
            "--fill-percent": `${fillPercent}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
