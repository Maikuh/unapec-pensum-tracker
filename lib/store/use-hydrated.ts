'use client'

import { useSyncExternalStore } from 'react'
import { useSelectedSubjectsStore } from './use-selected-subjects'

// `persist` is only attached when storage exists (i.e. not during prerender)
const getPersist = () =>
	useSelectedSubjectsStore.persist as
		| typeof useSelectedSubjectsStore.persist
		| undefined

const subscribe = (onChange: () => void) =>
	getPersist()?.onFinishHydration(onChange) ?? (() => {})

const getSnapshot = () => getPersist()?.hasHydrated() ?? false

/**
 * True once the selected-subjects store has been rehydrated from localStorage
 * (triggered by <StoreInitializer />). Always false on the server, so it can be
 * used to gate logic that must only run against the persisted state.
 */
export function useHydrated(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
