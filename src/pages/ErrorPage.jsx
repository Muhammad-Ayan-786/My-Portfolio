import { isRouteErrorResponse, useRouteError } from 'react-router'

/** Last-resort boundary (renders outside the main layout). */
export default function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? `${error.status} — ${error.statusText || error.data}` : 'Something broke.'

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg px-6 text-center text-fg">
      <title>Error — Mohd Ayan</title>
      <p className="type-label text-muted">Unexpected error</p>
      <h1 className="type-display text-[clamp(4rem,14vw,12rem)]">
        Oops<span className="text-accent">.</span>
      </h1>
      <p className="type-serif text-2xl">{message}</p>
      <a href="/" className="type-label mt-4 rounded-full bg-fg px-6 py-3.5 text-bg">
        Reload home
      </a>
    </main>
  )
}
