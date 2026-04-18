import { ElectiveTable } from '@/components/elective-table'
import type { ElectiveGroup } from '@/types'

interface ElectivesSectionProps {
	groups: ElectiveGroup[]
}

export function ElectivesSection({ groups }: ElectivesSectionProps) {
	if (groups.length === 0) return null

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Asignaturas Electivas</h2>
			<div className="space-y-6">
				{groups.map((group) => (
					<ElectiveTable key={group.name} group={group} />
				))}
			</div>
		</div>
	)
}
