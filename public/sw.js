// Bump the version to drop every cached asset on the next activation.
const CACHE = 'pensum-v2'

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

function putInCache(request, response) {
	if (!response.ok || response.type === 'opaque') return
	const clone = response.clone()
	caches.open(CACHE).then((c) => c.put(request, clone))
}

// Hashed build assets never change: serve from cache, fill on first use.
function cacheFirst(request) {
	return caches.match(request).then(
		(cached) =>
			cached ??
			fetch(request).then((res) => {
				putInCache(request, res)
				return res
			}),
	)
}

// Pages and RSC payloads: always try the network so data stays fresh, keep a
// copy of every visited page so it also works offline.
function networkFirst(request, fallbackToHome) {
	return fetch(request)
		.then((res) => {
			putInCache(request, res)
			return res
		})
		.catch(() =>
			caches
				.match(request, { ignoreSearch: true })
				.then(
					(cached) =>
						cached ??
						(fallbackToHome
							? caches.match(self.registration.scope)
							: Response.error()),
				),
		)
}

self.addEventListener('fetch', (e) => {
	const { request } = e
	if (request.method !== 'GET') return
	const url = new URL(request.url)
	if (url.origin !== self.location.origin) return

	if (url.pathname.includes('/_next/static/')) {
		e.respondWith(cacheFirst(request))
	} else if (request.mode === 'navigate') {
		e.respondWith(networkFirst(request, true))
	} else if (url.searchParams.has('_rsc') || request.headers.get('RSC')) {
		e.respondWith(networkFirst(request, false))
	}
})
