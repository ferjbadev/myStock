import { Card } from '../components/ui'
import { diagnosticoSupabase } from '../lib/supabase'

function Estado({ nombre, presente }: { nombre: string; presente: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 py-1.5">
      <code className="truncate text-xs text-brand-soft">{nombre}</code>
      <span className={`shrink-0 text-xs ${presente ? 'text-good' : 'text-bad'}`}>
        {presente ? 'ok' : 'falta'}
      </span>
    </li>
  )
}

/** Se muestra cuando faltan las variables de entorno de Supabase. */
export default function SinConfigurar() {
  const { url, publishableKey, anonKey } = diagnosticoSupabase()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Falta conectar Supabase</h1>

      <Card className="space-y-2 text-sm">
        <h2 className="text-sm font-semibold">Qué llegó a este build</h2>
        <ul className="divide-y divide-line">
          <Estado nombre="VITE_SUPABASE_URL" presente={url} />
          <Estado nombre="VITE_SUPABASE_PUBLISHABLE_KEY" presente={publishableKey} />
          <Estado nombre="VITE_SUPABASE_ANON_KEY" presente={anonKey} />
        </ul>
        <p className="text-xs text-muted">
          Hace falta la URL y una de las dos llaves.
        </p>
      </Card>

      <Card className="space-y-3 text-sm">
        <h2 className="text-sm font-semibold">En local</h2>
        <p className="text-muted">
          Pon los valores en <code className="text-brand-soft">myStock/.env.local</code> y
          reinicia <code className="text-brand-soft">npm run dev</code>.
        </p>
      </Card>

      <Card className="space-y-3 text-sm">
        <h2 className="text-sm font-semibold">En Vercel</h2>
        <p className="text-muted">
          Settings &gt; Environment Variables, marcando <strong>Production</strong>. Vite inyecta
          las variables durante el build, así que después hay que hacer{' '}
          <strong>Redeploy</strong> sin caché.
        </p>
      </Card>
    </div>
  )
}
