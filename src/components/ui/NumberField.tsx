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
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--text)" }}
      >
        {label}
      </label>

      <div
        className="flex items-center rounded-xl border px-3"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full border-0 bg-transparent py-2.5 text-sm font-medium outline-none"
          style={{ color: "var(--text)" }}
        />
        {suffix ? (
          <span
            className="ml-3 shrink-0 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
