import { useMemo, useState } from 'react'
import ListaPorDia from '../components/ListaPorDia'
import ModalRegistro from '../components/ModalRegistro'
import SelectorMes from '../components/SelectorMes'
import { BotonFlotante, Card, Encabezado } from '../components/ui'
import { agregarGasto, eliminarGasto } from '../data/almacen'
import { useAlmacen } from '../hooks/useAlmacen'
import { agruparPorDia, delMes, sumarMontos } from '../lib/calculos'
import { mesActual } from '../lib/dates'
import { formatMes, formatUsd } from '../lib/format'
import type { Gasto } from '../types'

export default function GastosScreen() {
  const { gastos } = useAlmacen()
  const [mes, setMes] = useState(mesActual())
  const [abierto, setAbierto] = useState(false)

  const delMesActual = useMemo(() => delMes(gastos, mes), [gastos, mes])
  const grupos = useMemo(() => agruparPorDia(delMesActual), [delMesActual])
  const total = sumarMontos(delMesActual)

  function borrar(gasto: Gasto) {
    if (!confirm(`¿Eliminar "${gasto.nombre}"?`)) return
    eliminarGasto(gasto.id)
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
          {delMesActual.length}{' '}
          {delMesActual.length === 1 ? 'gasto registrado' : 'gastos registrados'}
        </p>
      </Card>

      <ListaPorDia
        grupos={grupos}
        signo="-"
        onEliminar={borrar}
        vacio="No hay gastos en este mes."
      />

      <BotonFlotante onClick={() => setAbierto(true)} label="Registrar gasto" />

      <ModalRegistro
        titulo="Nuevo gasto"
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        onGuardar={agregarGasto}
        etiquetaNombre="¿En qué gastaste?"
        placeholderNombre="Ej. mercado"
        textoBoton="Guardar gasto"
      />
    </div>
  )
}
