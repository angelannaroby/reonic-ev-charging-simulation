type ToggleFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm font-medium" style={{ color: 'var(--text)' }}>
        {label}
      </label>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-[18px] w-8 items-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          borderColor: checked ? 'rgba(99, 102, 241, 0.32)' : 'var(--border-strong, #cbd5e1)',
          backgroundColor: checked ? 'var(--accent)' : 'var(--surface-muted, #e9edf5)',
          boxShadow: checked
            ? 'inset 0 1px 2px rgba(255,255,255,0.12)'
            : 'inset 0 1px 2px rgba(15, 23, 42, 0.08)',
        }}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full border transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
          style={{
            backgroundColor: '#ffffff',
            borderColor: checked ? 'rgba(99, 102, 241, 0.22)' : 'rgba(148, 163, 184, 0.55)',
            boxShadow: checked
              ? '0 0 0 1px rgba(255,255,255,0.92), 0 1px 3px rgba(15, 23, 42, 0.18)'
              : '0 1px 3px rgba(15, 23, 42, 0.14)',
          }}
        />
      </button>
    </div>
  )
}