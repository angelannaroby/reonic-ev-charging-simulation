type ToggleFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleField({
  label,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label
        className="text-sm font-medium"
        style={{ color: "var(--text)" }}
      >
        {label}
      </label>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-[18px] w-8 items-center rounded-full border transition-colors"
        style={{
          borderColor: checked ? "var(--accent)" : "var(--border)",
          backgroundColor: checked ? "var(--accent)" : "var(--surface)",
        }}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-[16px]" : "translate-x-[1px]"
          }`}
          style={{ backgroundColor: "var(--surface)" }}
        />
      </button>
    </div>
  )
}