import { Card } from '../components/ui'

/** Se muestra cuando faltan las variables de entorno de Supabase. */
export default function SinConfigurar() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Falta conectar Supabase</h1>
      <Card className="space-y-3 text-sm">
        <p>
          Crea un archivo <code className="text-brand-soft">.env.local</code> en la raíz del
          proyecto con tus credenciales:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-surface-2 p-3 text-xs">
          {'VITE_SUPABASE_URL=...\nVITE_SUPABASE_PUBLISHABLE_KEY=...'}
        </pre>
        <p className="text-muted">
          Las consigues en Supabase con el botón <strong>Connect</strong>, o en{' '}
          <strong>Settings &gt; API Keys</strong>. Luego reinicia{' '}
          <code className="text-brand-soft">npm run dev</code>.
        </p>
        <p className="text-muted">
          Falta también ejecutar <code className="text-brand-soft">supabase/schema.sql</code> en el
          SQL Editor de tu proyecto para crear las tablas.
        </p>
      </Card>
    </div>
  )
}
