import { ElectiveTable } from '@/components/elective-table'
import type { ElectiveGroup } from '@/types'

interface CertificationsSectionProps {
	groups: ElectiveGroup[]
}

export function CertificationsSection({ groups }: CertificationsSectionProps) {
	if (groups.length === 0) return null

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Certificaciones</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{groups.map((group) => (
					<ElectiveTable key={group.name} group={group} />
				))}
			</div>
		</div>
	)
}
