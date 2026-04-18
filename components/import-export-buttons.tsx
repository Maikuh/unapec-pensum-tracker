'use client'

import { Download, Upload } from 'lucide-react'
import posthog from 'posthog-js'
import { type ChangeEvent, useRef } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { isValidSelectedSubjects } from '@/lib/helpers/is-valid-selected-subjects'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'

export function ImportExportButtons() {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { exportToFile, importFromFile } = useSelectedSubjectsStore()

	function handleImport(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return

		if (file.type !== 'application/json') {
			alert('Por favor seleccione un archivo JSON válido')
			return
		}

		const reader = new FileReader()
		reader.onload = (event) => {
			try {
				const parsed = JSON.parse(event.target?.result as string)
				if (!isValidSelectedSubjects(parsed)) {
					posthog.capture('data_import_failed', { reason: 'invalid_format' })
					alert('El archivo no tiene el formato esperado')
					return
				}
				importFromFile(parsed)
				const pensumCount = Object.keys(parsed).length
				const totalSubjects = Object.values(parsed).reduce(
					(sum: number, subjects) => sum + (subjects as unknown[]).length,
					0,
				)
				posthog.capture('data_imported', {
					pensum_count: pensumCount,
					total_subjects: totalSubjects,
				})
			} catch {
				posthog.capture('data_import_failed', { reason: 'invalid_json' })
				alert('El archivo no es un JSON válido')
			}
		}
		reader.readAsText(file)

		// Reset so the same file can be re-imported
		e.target.value = ''
	}

	return (
		<>
			<Tooltip>
				<TooltipTrigger
					onClick={() => {
						posthog.capture('data_exported')
						exportToFile()
					}}
					aria-label="Exportar datos a archivo"
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<Download className="h-5 w-5" />
				</TooltipTrigger>
				<TooltipContent>Exportar datos</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					onClick={() => fileInputRef.current?.click()}
					aria-label="Importar datos de archivo"
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<Upload className="h-5 w-5" />
				</TooltipTrigger>
				<TooltipContent>Importar datos</TooltipContent>
			</Tooltip>

			<input
				ref={fileInputRef}
				type="file"
				accept="application/json"
				className="hidden"
				onChange={handleImport}
			/>
		</>
	)
}
