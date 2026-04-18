import { ElectiveTable } from '@/components/elective-table'
import { SectionIntro } from '@/components/elective-table/section-intro'
import type { ElectiveSection } from '@/types'

interface CertificationsSectionProps {
	section: ElectiveSection
}

export function CertificationsSection({ section }: CertificationsSectionProps) {
	if (section.groups.length === 0) return null

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Certificaciones</h2>
			{section.intro.length > 0 && <SectionIntro items={section.intro} />}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{section.groups.map((group) => (
					<ElectiveTable key={group.name} group={group} />
				))}
			</div>
		</div>
	)
}
