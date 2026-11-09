import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useHydrated } from './use-hydrated'
import { useSelectedSubjectsStore } from './use-selected-subjects'

describe('useHydrated', () => {
	it('is false until the persisted store is rehydrated, then true', async () => {
		const { result } = renderHook(() => useHydrated())
		expect(result.current).toBe(false)
		await act(() => useSelectedSubjectsStore.persist.rehydrate())
		expect(result.current).toBe(true)
	})
})

function Probe() {
	return <span>{String(useHydrated())}</span>
}

describe('useHydrated — server and storage-less environments', () => {
	it('is false when rendered on the server', async () => {
		const { renderToString } = await import('react-dom/server')
		expect(renderToString(<Probe />)).toContain('false')
	})

	it('is false when the persist API is unavailable (no localStorage)', () => {
		const store = useSelectedSubjectsStore as { persist?: unknown }
		const original = store.persist
		store.persist = undefined
		try {
			const { result } = renderHook(() => useHydrated())
			expect(result.current).toBe(false)
		} finally {
			store.persist = original
		}
	})
})
