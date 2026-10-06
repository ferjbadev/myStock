import { useMemo, useState } from 'react'
import ListaPorDia from '../components/ListaPorDia'
import ModalRegistro from '../components/ModalRegistro'
import SelectorMes from '../components/SelectorMes'
import { BotonFlotante, Card, Encabezado } from '../components/ui'
import { agregarIngreso, eliminarIngreso } from '../data/almacen'
import { useAlmacen } from '../hooks/useAlmacen'
import { agruparPorDia, delMes, sumarMontos } from '../lib/calculos'
import { mesActual } from '../lib/dates'
import { formatMes, formatUsd } from '../lib/format'
import type { Ingreso } from '../types'

export default function IngresosScreen() {
  const { ingresos } = useAlmacen()
  const [mes, setMes] = useState(mesActual())
  const [abierto, setAbierto] = useState(false)

  const delMesActual = useMemo(() => delMes(ingresos, mes), [ingresos, mes])
  const grupos = useMemo(() => agruparPorDia(delMesActual), [delMesActual])
  const total = sumarMontos(delMesActual)

  function borrar(ingreso: Ingreso) {
    if (!confirm(`¿Eliminar "${ingreso.nombre}"?`)) return
    eliminarIngreso(ingreso.id)
  }

  return (
    <div className="space-y-4">
      <Encabezado
        detalle="Mis ingresos"
        titulo={formatMes(mes)}
        acciones={<SelectorMes mes={mes} onChange={setMes} />}
      />

      <Card className="bg-linear-to-br from-good/20 via-surface to-surface">
        <p className="text-xs text-muted">Total del mes</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-good">{formatUsd(total)}</p>
        <p className="mt-1 text-xs text-muted">
          {delMesActual.length}{' '}
          {delMesActual.length === 1 ? 'ingreso registrado' : 'ingresos registrados'}
        </p>
      </Card>

      <ListaPorDia
        grupos={grupos}
        signo="+"
        onEliminar={borrar}
        vacio="No hay ingresos en este mes."
      />

      <BotonFlotante onClick={() => setAbierto(true)} label="Registrar ingreso" />

      <ModalRegistro
        titulo="Nuevo ingreso"
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        onGuardar={agregarIngreso}
        etiquetaNombre="¿De dónde viene?"
        placeholderNombre="Ej. quincena"
        textoBoton="Guardar ingreso"
      />
    </div>
  )
}
