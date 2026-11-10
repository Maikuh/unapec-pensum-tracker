// Single PostHog instance for the app. It must be the same module that
// instrumentation-client.ts initializes: importing `posthog-js` directly would
// give an uninitialized singleton and pull the full (non-slim) bundle back in.
export { default as posthog } from 'posthog-js/dist/module.slim'
