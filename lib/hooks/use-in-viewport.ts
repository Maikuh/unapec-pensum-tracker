'use client'

import { useEffect, useState } from 'react'

type RefCallback<T extends Element> = (node: T | null) => void

export function useInViewport<T extends Element>(
	options?: IntersectionObserverInit,
): [RefCallback<T>, boolean] {
	const [node, setNode] = useState<T | null>(null)
	const [isInView, setIsInView] = useState(false)

	useEffect(() => {
		if (!node || typeof IntersectionObserver === 'undefined') return
		const observer = new IntersectionObserver(
			([entry]) => setIsInView(entry.isIntersecting),
			{ threshold: 0, rootMargin: '0px', ...options },
		)
		observer.observe(node)
		return () => observer.disconnect()
	}, [node, options])

	return [setNode, isInView]
}
