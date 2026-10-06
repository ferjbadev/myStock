import { useMemo, useState } from 'react'
import ModalRegistro from '../components/ModalRegistro'
import { BarraProgreso, BotonFlotante, Card, Encabezado, Vacio } from '../components/ui'
import { estaLiquidado, pendiente } from '../lib/calculos'
import { formatDiaCorto, formatUsd } from '../lib/format'

/** Forma común de un préstamo o una deuda. */
interface Compromiso {
  id: string
  monto: number
  montoPagado: number
  fecha: string
}

interface Props<T extends Compromiso> {
  /** Título de la pantalla, ej. "Mis préstamos". */
  titulo: string
  /** Pregunta por la persona involucrada en el modal. */
  etiquetaPersona: string
  /** Texto del total pendiente, ej. "Por cobrar". */
  etiquetaTotal: string
  /** Color de acento en hex. */
  acento: string
  items: T[]
  nombreDe: (item: T) => string
  textoAbono: string
  textoVacio: string
  crear: (nombre: string, monto: number) => void
  actualizarPagado: (id: string, montoPagado: number) => void
  eliminar: (id: string) => void
}

/**
 * Préstamos (lo que me deben) y deudas (lo que yo debo) funcionan igual:
 * una persona, un monto y abonos parciales.
 */
export default function CompromisosScreen<T extends Compromiso>({
  titulo,
  etiquetaPersona,
  etiquetaTotal,
  acento,
  items,
  nombreDe,
  textoAbono,
  textoVacio,
  crear,
  actualizarPagado,
  eliminar,
}: Props<T>) {
  const [verLiquidados, setVerLiquidados] = useState(false)
  const [nuevoAbierto, setNuevoAbierto] = useState(false)
  const [abonando, setAbonando] = useState<T | null>(null)

  const { activos, liquidados, totalPendiente } = useMemo(
    () => ({
      activos: items.filter((i) => !estaLiquidado(i)),
      liquidados: items.filter(estaLiquidado),
      totalPendiente: items.reduce((acc, i) => acc + pendiente(i), 0),
    }),
    [items],
  )

  const visibles = verLiquidados ? liquidados : activos
  // El modal de abono guarda el item, así que hay que releerlo del listado
  // para no mostrar un monto viejo después de un abono.
  const enAbono = abonando ? (items.find((i) => i.id === abonando.id) ?? null) : null

  function guardarAbono(_nombre: string, monto: number) {
    if (!enAbono) return
    actualizarPagado(enAbono.id, Math.min(enAbono.monto, enAbono.montoPagado + monto))
    setAbonando(null)
  }

  function borrar(item: T) {
    if (!confirm(`¿Eliminar el registro de ${nombreDe(item)}?`)) return
    eliminar(item.id)
  }

  return (
    <div className="space-y-4">
      <Encabezado detalle={etiquetaTotal} titulo={titulo} />

      <Card>
        <p className="text-xs text-muted">{etiquetaTotal}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight" style={{ color: acento }}>
          {formatUsd(totalPendiente)}
        </p>
        <p className="mt-1 text-xs text-muted">
          {activos.length} {activos.length === 1 ? 'registro activo' : 'registros activos'} ·{' '}
          {liquidados.length} liquidado{liquidados.length === 1 ? '' : 's'}
        </p>
      </Card>

      <div className="flex gap-2">
        {[
          { id: false, label: `Activos (${activos.length})` },
          { id: true, label: `Liquidados (${liquidados.length})` },
        ].map((tab) => (
          <button
            key={String(tab.id)}
            type="button"
            onClick={() => setVerLiquidados(tab.id)}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
              verLiquidados === tab.id
                ? 'border-brand bg-brand/20 text-white'
                : 'border-line bg-surface text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <Card>
          <Vacio mensaje={verLiquidados ? 'Todavía no hay registros liquidados.' : textoVacio} />
        </Card>
      ) : (
        <ul className="space-y-3">
          {visibles.map((item) => {
            const falta = pendiente(item)
            const avance = (item.montoPagado / item.monto) * 100
            return (
              <li key={item.id}>
                <Card className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{nombreDe(item)}</p>
                      <p className="text-xs text-muted">{formatDiaCorto(item.fecha)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold tabular-nums" style={{ color: acento }}>
                        {formatUsd(falta)}
                      </p>
                      <p className="text-[11px] text-muted">de {formatUsd(item.monto)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <BarraProgreso porcentaje={avance} color={acento} />
                    <p className="text-[11px] text-muted">Abonado {formatUsd(item.montoPagado)}</p>
                  </div>

                  <div className="flex gap-2">
                    {falta > 0 && (
                      <button
                        type="button"
                        onClick={() => setAbonando(item)}
                        className="flex-1 rounded-xl border border-line bg-surface-2 py-2 text-sm"
                      >
                        {textoAbono}
                      </button>
                    )}
                    {falta > 0 && (
                      <button
                        type="button"
                        onClick={() => actualizarPagado(item.id, item.monto)}
                        className="rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-muted"
                      >
                        Liquidar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => borrar(item)}
                      className="rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-muted"
                      aria-label="Eliminar"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                        <path d="M9 3h6l1 2h4v2H4V5h4zM6 9h12l-1 12H7z" />
                      </svg>
                    </button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <BotonFlotante onClick={() => setNuevoAbierto(true)} label={`Agregar en ${titulo}`} />

      <ModalRegistro
        titulo={titulo}
        abierto={nuevoAbierto}
        onCerrar={() => setNuevoAbierto(false)}
        onGuardar={crear}
        etiquetaNombre={etiquetaPersona}
        placeholderNombre="Nombre"
      />

      <ModalRegistro
        titulo={enAbono ? `${textoAbono}: ${nombreDe(enAbono)}` : textoAbono}
        abierto={enAbono !== null}
        onCerrar={() => setAbonando(null)}
        onGuardar={guardarAbono}
        pedirNombre={false}
        textoBoton="Registrar"
        nota={
          enAbono
            ? `Falta ${formatUsd(pendiente(enAbono))} de ${formatUsd(enAbono.monto)}.`
            : undefined
        }
      />
    </div>
  )
}
