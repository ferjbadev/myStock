import { useCallback, useMemo, useState } from 'react'
import ListaPorDia from '../components/ListaPorDia'
import ModalRegistro from '../components/ModalRegistro'
import SelectorMes from '../components/SelectorMes'
import { BotonFlotante, Card, Cargando, Encabezado, MensajeError } from '../components/ui'
import { recalcularCierre } from '../data/cierres'
import { crearGasto, eliminarGasto, listarGastosDelMes } from '../data/gastos'
import { useQuery } from '../hooks/useQuery'
import { agruparPorDia, sumarMontos } from '../lib/calculos'
import { hoyKey, mesActual } from '../lib/dates'
import { formatMes, formatUsd } from '../lib/format'
import type { Gasto } from '../types'

export default function GastosScreen() {
  const [mes, setMes] = useState(mesActual())
  const cargar = useCallback(() => listarGastosDelMes(mes), [mes])
  const { data, loading, error, recargar } = useQuery(cargar)
  const [abierto, setAbierto] = useState(false)

  const gastos = data ?? []
  const grupos = useMemo(() => agruparPorDia(data ?? []), [data])
  const total = sumarMontos(gastos)

  async function guardar(nombre: string, monto: number) {
    await crearGasto({ nombre, monto, fecha: hoyKey() })
    recargar()
  }

  async function borrar(gasto: Gasto) {
    if (!confirm(`¿Eliminar "${gasto.nombre}"?`)) return
    await eliminarGasto(gasto.id)
    // Si el gasto era de un día ya cerrado, hay que rehacer su consolidado.
    await recalcularCierre(gasto.fecha)
    recargar()
  }

  return (
    <div className="space-y-4">
      <Encabezado
        detalle="Mis gastos"
        titulo={formatMes(mes)}
        acciones={<SelectorMes mes={mes} onChange={setMes} />}
      />

      <Card className="bg-linear-to-br from-brand/20 via-surface to-surface">
        <p className="text-xs text-muted">Total del mes</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{formatUsd(total)}</p>
        <p className="mt-1 text-xs text-muted">
          {gastos.length} {gastos.length === 1 ? 'gasto registrado' : 'gastos registrados'}
        </p>
      </Card>

      {error && <MensajeError mensaje={error} onReintentar={recargar} />}
      {loading && !error ? (
        <Cargando />
      ) : (
        <ListaPorDia
          grupos={grupos}
          signo="-"
          onEliminar={borrar}
          vacio="No hay gastos en este mes."
        />
      )}

      <BotonFlotante onClick={() => setAbierto(true)} label="Registrar gasto" />

      <ModalRegistro
        titulo="Nuevo gasto"
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        onGuardar={guardar}
        etiquetaNombre="¿En qué gastaste?"
        placeholderNombre="Ej. mercado"
        textoBoton="Guardar gasto"
      />
    </div>
  )
}
