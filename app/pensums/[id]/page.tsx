import { notFound } from 'next/navigation'
import { PensumContent } from '@/components/pensum-content'
import pensumsData from '@/lib/data/pensums.json'
import type { Pensum } from '@/types'

const pensums = pensumsData as Pensum[]

export const dynamicParams = false

export function generateStaticParams() {
	return pensums.map((pensum) => ({ id: pensum.pensumCode }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const pensum = pensums.find((p) => p.pensumCode === id)
	if (!pensum) return {}
	const title = `${pensum.pensumCode} - ${pensum.carreerName} | UNAPEC Pensum Tracker`
	const description = `Sigue tu progreso en la carrera de ${pensum.carreerName} en UNAPEC.`
	const url = `/pensums/${id}`
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: 'website',
			siteName: 'UNAPEC Pensum Tracker',
			title,
			description,
			url,
			images: [{ url: '/og-image.png', width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['/og-image.png'],
		},
	}
}

export default async function PensumPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const pensum = pensums.find((p) => p.pensumCode === id)

	if (!pensum) notFound()

	return <PensumContent pensum={pensum} />
}
