'use client'

import { useSyncExternalStore } from 'react'

// Returns true on the client after hydration, false on the server.
// Use this to avoid hydration mismatches when rendering localStorage-dependent state.
const emptySubscribe = () => () => {}

export function useHydrated(): boolean {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	)
}
