import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext({ loaded: false, setLoaded: () => {} })

/**
 * `loaded` flips to true the moment the preloader curtain starts lifting,
 * so page intro animations can play exactly in sync with it.
 */
export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false)
  const value = useMemo(() => ({ loaded, setLoaded }), [loaded])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

/** Shared flag: has the user navigated client-side at least once? */
export const session = { navigated: false }

/**
 * Hook for page intros: returns whether the intro may play and how long it
 * should wait (longer after a page transition so the curtain clears first).
 */
export function useIntro() {
  const { loaded } = useApp()
  return { play: loaded, delay: session.navigated ? 0.55 : 0.15 }
}
