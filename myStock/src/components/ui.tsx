import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>
      {children}
    </section>
  )
}

export function Encabezado({
  titulo,
  detalle,
  acciones,
}: {
  titulo: string
  detalle?: string
  acciones?: ReactNode
}) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        {detalle && <p className="text-xs text-muted">{detalle}</p>}
        <h1 className="text-xl font-semibold capitalize">{titulo}</h1>
      </div>
      {acciones}
    </header>
  )
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold">{titulo}</h2>
      {children}
    </Card>
  )
}

export function Cargando({ filas = 3 }: { filas?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />
      ))}
    </div>
  )
}

export function MensajeError({
  mensaje,
  onReintentar,
}: {
  mensaje: string
  onReintentar?: () => void
}) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-bad">{mensaje}</p>
      {onReintentar && (
        <button type="button" onClick={onReintentar} className="text-sm text-brand-soft underline">
          Reintentar
        </button>
      )}
    </Card>
  )
}

export function Vacio({ mensaje }: { mensaje: string }) {
  return <p className="py-2 text-sm text-muted">{mensaje}</p>
}

export function BarraProgreso({ porcentaje, color }: { porcentaje: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
      <div
        className={`h-full rounded-full ${color ? '' : 'bg-brand'}`}
        style={{ width: `${Math.min(100, Math.max(0, porcentaje))}%`, background: color }}
      />
    </div>
  )
}

export function BotonFlotante({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-24 left-1/2 z-10 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
        <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
      </svg>
    </button>
  )
}

export function Hoja({
  titulo,
  abierta,
  onCerrar,
  children,
}: {
  titulo: string
  abierta: boolean
  onCerrar: () => void
  children: ReactNode
}) {
  if (!abierta) return null

  return (
    <div className="fixed inset-0 z-20 flex items-end bg-black/60" onClick={onCerrar}>
      <div
        role="dialog"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto max-h-[88svh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="text-muted">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M6.4 5l6 6 6-6 1.4 1.4-6 6 6 6-1.4 1.4-6-6-6 6L5 18.4l6-6-6-6z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  )
}

export function EntradaMonto({
  valor,
  onChange,
  autoFocus,
}: {
  valor: string
  onChange: (valor: string) => void
  autoFocus?: boolean
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2.5 focus-within:border-brand">
      <span className="text-xl text-muted">$</span>
      <input
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0,00"
        className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-muted"
      />
    </div>
  )
}

export function EntradaTexto({
  valor,
  onChange,
  placeholder,
  autoFocus,
}: {
  valor: string
  onChange: (valor: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <input
      type="text"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-base outline-none placeholder:text-muted focus:border-brand"
    />
  )
}

export function BotonPrincipal({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-brand py-3 text-base font-medium text-white active:scale-[0.99] disabled:opacity-40"
    >
      {children}
    </button>
  )
}
