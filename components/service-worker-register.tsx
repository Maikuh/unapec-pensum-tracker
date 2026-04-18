'use client'
import { useEffect } from 'react'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'

export function ServiceWorkerRegister() {
	useEffect(() => {
		if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` })
		}
	}, [])
	return null
}
