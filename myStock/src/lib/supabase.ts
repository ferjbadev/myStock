import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
// Supabase está migrando de la llave `anon` (JWT) a la `publishable`
// (sb_publishable_...). Las dos sirven igual aquí, así que aceptamos ambas.
const publicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && publicKey)

/** Qué variables de entorno alcanzó a ver el build. Para depurar despliegues. */
export function diagnosticoSupabase() {
  return {
    url: Boolean(import.meta.env.VITE_SUPABASE_URL),
    publishableKey: Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
    anonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  }
}

/**
 * Cliente único de Supabase. Si faltan las variables de entorno dejamos un
 * cliente apuntando a una URL inválida: `supabaseConfigurado` es false y la UI
 * muestra las instrucciones en vez de fallar al importar.
 */
export const supabase = createClient(url ?? 'http://localhost', publicKey ?? 'sin-clave', {
  auth: { persistSession: false },
})
