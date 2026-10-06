/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  /** Llave nueva (sb_publishable_...). */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Llave legacy (JWT eyJ...). Sirve igual. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
