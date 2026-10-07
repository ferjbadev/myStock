import { useEffect, useMemo, useState } from 'react'
import SelectorMes from '../components/SelectorMes'
import { BarraProgreso, Card, Encabezado, Seccion, Vacio } from '../components/ui'
import { PRESUPUESTO_MENSUAL } from '../config'
import { useAlmacen } from '../hooks/useAlmacen'
import { mesActual, msHastaMedianoche } from '../lib/dates'
import { formatDiaRelativo, formatMes, formatRestante, formatUsd } from '../lib/format'
import { construirResumen } from '../lib/resumen'
import type { TabId } from '../components/BottomNav'

/** Tiempo que falta para el cierre del ciclo, actualizado cada medio minuto. */
function useCuentaRegresiva() {
  const [restante, setRestante] = useState(() => msHastaMedianoche())

  useEffect(() => {
    const id = setInterval(() => setRestante(msHastaMedianoche()), 30_000)
    return () => clearInterval(id)
  }, [])

  return restante
}

function Metrica({ label, valor, color }: { label: string; valor: string; color?: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-base font-medium tabular-nums ${color ?? ''}`}>{valor}</p>
    </div>
  )
}

interface Props {
  onIrA: (tab: TabId) => void
}

export default function ResumenScreen({ onIrA }: Props) {
  const estado = useAlmacen()
  const [mes, setMes] = useState(mesActual())
  const restante = useCuentaRegresiva()

  const data = useMemo(() => construirResumen(estado, mes), [estado, mes])

  const esMesActual = mes === mesActual()
  const usado = (data.mesGastos / PRESUPUESTO_MENSUAL) * 100
  const libre = PRESUPUESTO_MENSUAL - data.mesGastos

  return (
    <div className="space-y-4">
      <Encabezado
        detalle="Resumen de"
        titulo={formatMes(mes)}
        acciones={<SelectorMes mes={mes} onChange={setMes} />}
      />

      {esMesActual && (
        <Card className="bg-linear-to-br from-brand/25 via-surface to-surface">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Ciclo de hoy</p>
            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[11px] text-brand-soft">
              cierra en {formatRestante(restante)}
            </span>
          </div>
          <p className="mt-1 text-4xl font-semibold tracking-tight">{formatUsd(data.hoy.gastos)}</p>
          <p className="mt-1 text-xs text-muted">
            gastado hoy · {data.hoy.movimientos}{' '}
            {data.hoy.movimientos === 1 ? 'movimiento' : 'movimientos'}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
            <Metrica
              label="Ingresos de hoy"
              valor={formatUsd(data.hoy.ingresos)}
              color="text-good"
            />
            <Metrica
              label="Saldo del día"
              valor={formatUsd(data.hoy.saldo)}
              color={data.hoy.saldo < 0 ? 'text-bad' : 'text-good'}
            />
          </dl>
        </Card>
      )}

      <Card>
        <dl className="grid grid-cols-2 gap-3">
          <Metrica label="Ingresos" valor={formatUsd(data.mesIngresos)} color="text-good" />
          <Metrica label="Gastos" valor={formatUsd(data.mesGastos)} />
        </dl>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-muted">Presupuesto {formatUsd(PRESUPUESTO_MENSUAL)}</span>
            <span className={libre < 0 ? 'text-bad' : 'text-good'}>
              {libre < 0 ? `${formatUsd(-libre)} de más` : `${formatUsd(libre)} libres`}
            </span>
          </div>
          <BarraProgreso porcentaje={usado} color={libre < 0 ? '#fb7185' : undefined} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onIrA('prestamos')} className="text-left">
          <Card>
            <p className="text-xs text-muted">Por cobrar</p>
            <p className="mt-1 text-lg font-semibold text-good tabular-nums">
              {formatUsd(data.porCobrar)}
            </p>
            <p className="text-[11px] text-muted">mis préstamos</p>
          </Card>
        </button>
        <button type="button" onClick={() => onIrA('deudas')} className="text-left">
          <Card>
            <p className="text-xs text-muted">Por pagar</p>
            <p className="mt-1 text-lg font-semibold text-bad tabular-nums">
              {formatUsd(data.porPagar)}
            </p>
            <p className="text-[11px] text-muted">mis deudas</p>
          </Card>
        </button>
      </div>

      <Seccion titulo="Últimos movimientos">
        {data.ultimosMovimientos.length === 0 ? (
          <Vacio mensaje="Registra tu primer movimiento del mes." />
        ) : (
          <ul className="divide-y divide-line">
            {data.ultimosMovimientos.map((mov) => (
              <li key={mov.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm">{mov.nombre}</p>
                  <p className="text-[11px] capitalize text-muted">{formatDiaRelativo(mov.fecha)}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-medium tabular-nums ${
                    mov.tipo === 'ingreso' ? 'text-good' : ''
                  }`}
                >
                  {mov.tipo === 'ingreso' ? '+' : '-'}
                  {formatUsd(mov.monto)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Seccion>
    </div>
  )
}
