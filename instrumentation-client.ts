// Slim build + only the extensions this app uses (event capture, pageviews,
// autocapture and exception tracking). Roughly halves PostHog's bundle size
// compared to the default entry, which also ships surveys, toolbar, product
// tours, etc. Add more from `posthog-js/dist/extension-bundles` if needed
// (e.g. SessionReplayExtensions).
import {
	AnalyticsExtensions,
	ErrorTrackingExtensions,
} from 'posthog-js/dist/extension-bundles'
import { posthog } from '@/lib/analytics'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? '', {
	api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	ui_host: 'https://us.posthog.com',
	defaults: '2026-01-30',
	capture_exceptions: true,
	__extensionClasses: {
		...AnalyticsExtensions,
		...ErrorTrackingExtensions,
	},
})
