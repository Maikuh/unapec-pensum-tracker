import { ElectiveTable } from '@/components/elective-table'
import { SectionIntro } from '@/components/elective-table/section-intro'
import type { ElectiveSection } from '@/types'

interface ElectivesSectionProps {
	section: ElectiveSection
}

export function ElectivesSection({ section }: ElectivesSectionProps) {
	if (section.groups.length === 0) return null

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Asignaturas Electivas</h2>
			{section.intro.length > 0 && <SectionIntro items={section.intro} />}
			<div className="space-y-6">
				{section.groups.map((group) => (
					<ElectiveTable key={group.name} group={group} />
				))}
			</div>
		</div>
	)
}
