import dynamic from 'next/dynamic'

export const LazyPrerequisiteDiagram = dynamic(
	() => import('./index').then((m) => ({ default: m.PrerequisiteDiagram })),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full animate-pulse bg-muted rounded" />
		),
	},
)
