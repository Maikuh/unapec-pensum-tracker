const CACHE = 'pensum-v1'

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(CACHE).then((c) => c.add(self.registration.scope)))
	self.skipWaiting()
})

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
				),
			),
	)
	self.clients.claim()
})

self.addEventListener('fetch', (e) => {
	const { request } = e
	const url = new URL(request.url)

	if (url.pathname.includes('/_next/static/')) {
		e.respondWith(
			caches.match(request).then(
				(cached) =>
					cached ??
					fetch(request).then((res) => {
						const clone = res.clone()
						caches.open(CACHE).then((c) => c.put(request, clone))
						return res
					}),
			),
		)
	} else if (request.mode === 'navigate') {
		e.respondWith(
			fetch(request).catch(() => caches.match(self.registration.scope)),
		)
	}
})
