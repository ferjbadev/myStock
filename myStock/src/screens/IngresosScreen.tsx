import { useCallback, useMemo, useState } from 'react'
import ListaPorDia from '../components/ListaPorDia'
import ModalRegistro from '../components/ModalRegistro'
import SelectorMes from '../components/SelectorMes'
import { BotonFlotante, Card, Cargando, Encabezado, MensajeError } from '../components/ui'
import { recalcularCierre } from '../data/cierres'
import { crearIngreso, eliminarIngreso, listarIngresosDelMes } from '../data/ingresos'
import { useQuery } from '../hooks/useQuery'
import { agruparPorDia, sumarMontos } from '../lib/calculos'
import { hoyKey, mesActual } from '../lib/dates'
import { formatMes, formatUsd } from '../lib/format'
import type { Ingreso } from '../types'

export default function IngresosScreen() {
  const [mes, setMes] = useState(mesActual())
  const cargar = useCallback(() => listarIngresosDelMes(mes), [mes])
  const { data, loading, error, recargar } = useQuery(cargar)
  const [abierto, setAbierto] = useState(false)

  const ingresos = data ?? []
  const grupos = useMemo(() => agruparPorDia(data ?? []), [data])
  const total = sumarMontos(ingresos)

  async function guardar(nombre: string, monto: number) {
    await crearIngreso({ nombre, monto, fecha: hoyKey() })
    recargar()
  }

  async function borrar(ingreso: Ingreso) {
    if (!confirm(`¿Eliminar "${ingreso.nombre}"?`)) return
    await eliminarIngreso(ingreso.id)
    await recalcularCierre(ingreso.fecha)
    recargar()
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
          {ingresos.length} {ingresos.length === 1 ? 'ingreso registrado' : 'ingresos registrados'}
        </p>
      </Card>

      {error && <MensajeError mensaje={error} onReintentar={recargar} />}
      {loading && !error ? (
        <Cargando />
      ) : (
        <ListaPorDia
          grupos={grupos}
          signo="+"
          onEliminar={borrar}
          vacio="No hay ingresos en este mes."
        />
      )}

      <BotonFlotante onClick={() => setAbierto(true)} label="Registrar ingreso" />

      <ModalRegistro
        titulo="Nuevo ingreso"
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        onGuardar={guardar}
        etiquetaNombre="¿De dónde viene?"
        placeholderNombre="Ej. quincena"
        textoBoton="Guardar ingreso"
      />
    </div>
  )
}
