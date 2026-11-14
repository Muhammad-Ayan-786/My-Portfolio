import { createBrowserRouter } from 'react-router'
import RootLayout from './components/layout/RootLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ErrorPage from './pages/ErrorPage'

/**
 * Lazy-load a page module. Each page becomes its own JS chunk; any exported
 * `loader` is picked up automatically.
 */
const page = (importer) => async () => {
  const mod = await importer()
  return { Component: mod.default, ...(mod.loader && { loader: mod.loader }) }
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <ErrorPage />,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: 'work', lazy: page(() => import('./pages/Work')) },
      { path: 'work/:slug', lazy: page(() => import('./pages/ProjectDetail')), errorElement: <NotFound /> },
      { path: 'services', lazy: page(() => import('./pages/Services')) },
      { path: 'about', lazy: page(() => import('./pages/About')) },
      { path: 'contact', lazy: page(() => import('./pages/Contact')) },
      { path: '*', Component: NotFound },
    ],
  },
])
