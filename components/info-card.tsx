'use client'

import {
	Calendar,
	CircleCheckBig,
	CreditCard,
	ExternalLink,
	FileText,
	History,
	Info,
	Network,
} from 'lucide-react'
import { ResetProgressButton } from '@/components/reset-progress-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { posthog } from '@/lib/analytics'
import { pensumPages } from '@/lib/data/pensum-pages'

interface InfoCardProps {
	pensumCode: string
	subjectsCount: number
	totalSubjects: number
	creditsCount: number
	totalCredits: number
	date: string
	onDiagramClick: () => void
	/** Subjects whose prerequisites are met and that aren't selected yet */
	availableCount?: number
	onAvailableClick?: () => void
	onReset?: () => void
	legacy?: boolean
}

export function InfoCard({
	pensumCode,
	subjectsCount,
	totalSubjects,
	creditsCount,
	totalCredits,
	date,
	onDiagramClick,
	availableCount,
	onAvailableClick,
	onReset,
	legacy = false,
}: InfoCardProps) {
	const formattedDate = new Date(date).toLocaleDateString('es-MX', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	})

	const subjectsPercent = Math.round((subjectsCount / totalSubjects) * 100)
	const creditsPercent = Math.round((creditsCount / totalCredits) * 100)
	const originalLink = pensumPages[pensumCode]

	return (
		<div className="flex justify-center mb-8">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle>Información</CardTitle>
					<div data-slot="card-action">
						<Button variant="outline" size="sm" onClick={onDiagramClick}>
							<Network className="h-4 w-4 mr-2" />
							Ver diagrama
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{legacy && (
						<div
							className="flex items-start gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3"
							data-testid="legacy-notice"
						>
							<History className="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
							<p className="text-sm">
								Este pensum ya no aparece en la página de UNAPEC (probablemente
								fue reemplazado por una versión más reciente). Se mantiene para
								quienes ya lo están cursando.
							</p>
						</div>
					)}
					<div className="flex items-start gap-3">
						<Calendar className="h-5 w-5 mt-0.5 text-sky-500 shrink-0" />
						<div>
							<p className="text-sm font-medium flex items-center gap-1">
								Fecha de generación
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											className="cursor-default text-muted-foreground hover:text-foreground"
											aria-label="Información sobre la fecha de generación"
										>
											<Info className="h-3.5 w-3.5" />
										</TooltipTrigger>
										<TooltipContent>
											La página oficial ya no provee la fecha del Pensum como
											antes.
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</p>
							<p
								className="text-sm text-muted-foreground"
								suppressHydrationWarning
							>
								{formattedDate}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<FileText className="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
						<div>
							<p className="text-sm font-medium">Materias</p>
							<p className="text-sm text-muted-foreground">
								<span data-testid="subjects-count">{subjectsCount}</span> (
								<span className="subject-credits-percentage">
									{subjectsPercent}%
								</span>
								) de <span data-testid="total-subjects">{totalSubjects}</span>
							</p>
							<Progress
								value={subjectsPercent}
								className="h-2 mt-1"
								indicatorClassName="bg-amber-500"
								aria-label="Progreso de materias"
							/>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<CreditCard className="h-5 w-5 mt-0.5 text-emerald-500 shrink-0" />
						<div>
							<p className="text-sm font-medium">Créditos</p>
							<p className="text-sm text-muted-foreground">
								<span data-testid="credits-count">{creditsCount}</span> (
								<span className="subject-credits-percentage">
									{creditsPercent}%
								</span>
								) de <span data-testid="total-credits">{totalCredits}</span>
							</p>
							<Progress
								value={creditsPercent}
								className="h-2 mt-1"
								indicatorClassName="bg-emerald-500"
								aria-label="Progreso de créditos"
							/>
						</div>
					</div>

					{availableCount !== undefined && (
						<div className="flex items-start gap-3">
							<CircleCheckBig className="h-5 w-5 mt-0.5 text-violet-500 shrink-0" />
							<div className="flex-1">
								<p className="text-sm font-medium">Disponibles para cursar</p>
								<p className="text-sm text-muted-foreground">
									<span data-testid="available-count">{availableCount}</span>{' '}
									materia{availableCount === 1 ? '' : 's'} con los
									prerrequisitos cumplidos
								</p>
							</div>
							{onAvailableClick && availableCount > 0 && (
								<Button variant="outline" size="sm" onClick={onAvailableClick}>
									Ver lista
								</Button>
							)}
						</div>
					)}
					{originalLink && (
						<div className="flex items-start gap-3">
							<ExternalLink className="h-5 w-5 mt-0.5 text-primary shrink-0" />
							<div>
								<p className="text-sm font-medium">Pensum Original</p>
								<a
									href={originalLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm underline hover:text-foreground"
									onClick={() =>
										posthog.capture('original_pensum_link_clicked', {
											pensum_code: pensumCode,
										})
									}
								>
									Link al Pensum
								</a>
							</div>
						</div>
					)}
					{onReset && (
						<div className="flex justify-end border-t pt-3">
							<ResetProgressButton
								disabled={subjectsCount === 0}
								onConfirm={onReset}
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
