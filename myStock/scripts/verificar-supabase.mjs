/**
 * Comprueba que .env.local y las tablas de Supabase estén listas.
 * Uso: npm run verificar
 *
 * No imprime las credenciales completas, solo si existen y si cada tabla
 * responde.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const TABLAS = ['gastos', 'ingresos', 'prestamos', 'deudas', 'cierres_diarios']
const COLUMNAS_ESPERADAS = {
  gastos: ['id', 'nombre', 'monto', 'fecha', 'creado_en'],
  ingresos: ['id', 'nombre', 'monto', 'fecha', 'creado_en'],
  prestamos: ['id', 'persona', 'monto', 'monto_pagado', 'fecha', 'creado_en'],
  deudas: ['id', 'acreedor', 'monto', 'monto_pagado', 'fecha', 'creado_en'],
  cierres_diarios: ['fecha', 'total_gastos', 'total_ingresos', 'saldo', 'cerrado_en'],
}

function leerEnv() {
  let contenido
  try {
    contenido = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  } catch {
    return null
  }

  const vars = {}
  for (const linea of contenido.split('\n')) {
    const limpia = linea.trim()
    if (!limpia || limpia.startsWith('#')) continue
    const corte = limpia.indexOf('=')
    if (corte === -1) continue
    vars[limpia.slice(0, corte).trim()] = limpia.slice(corte + 1).trim()
  }
  return vars
}

const env = leerEnv()
if (!env) {
  console.error('✗ No existe myStock/.env.local')
  console.error('  Copia .env.example como .env.local y pon tus credenciales.')
  process.exit(1)
}

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('✗ .env.local existe pero falta algún valor:')
  console.error(`  VITE_SUPABASE_URL: ${url ? 'ok' : 'VACÍO'}`)
  console.error(
    `  VITE_SUPABASE_PUBLISHABLE_KEY (o _ANON_KEY): ${key ? 'ok' : 'VACÍO'}`,
  )
  process.exit(1)
}

console.log(`✓ .env.local encontrado (proyecto: ${url})`)

const supabase = createClient(url, key, { auth: { persistSession: false } })
let fallos = 0

for (const tabla of TABLAS) {
  const columnas = COLUMNAS_ESPERADAS[tabla].join(', ')
  const { error, count } = await supabase
    .from(tabla)
    .select(columnas, { count: 'exact', head: true })

  if (error) {
    fallos += 1
    console.error(`✗ ${tabla}: ${error.message}`)
  } else {
    console.log(`✓ ${tabla}: ${count ?? 0} filas`)
  }
}

if (fallos > 0) {
  console.error('')
  console.error('Faltan tablas o columnas. Ejecuta en Supabase > SQL Editor:')
  console.error('  - supabase/schema.sql          (instalación nueva)')
  console.error('  - supabase/migracion_dolares.sql (si ya corriste el schema viejo)')
  process.exit(1)
}

// Prueba de escritura real: inserta y borra un gasto de prueba.
const { data, error: errorInsert } = await supabase
  .from('gastos')
  .insert({ nombre: 'PRUEBA (se borra sola)', monto: 1 })
  .select('id')
  .single()

if (errorInsert) {
  console.error(`✗ No se pudo escribir en gastos: ${errorInsert.message}`)
  console.error('  Revisa las políticas RLS al final de supabase/schema.sql.')
  process.exit(1)
}

await supabase.from('gastos').delete().eq('id', data.id)
console.log('✓ Escritura y borrado funcionando')
console.log('')
console.log('Todo listo. Abre la app y registra tu primer gasto.')
