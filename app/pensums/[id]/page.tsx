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
	return {
		title: `${pensum.pensumCode} - ${pensum.carreerName} | UNAPEC Pensum Tracker`,
		alternates: {
			canonical: `/pensums/${id}`,
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
