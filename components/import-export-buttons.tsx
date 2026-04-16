'use client'

import { Download, Upload } from 'lucide-react'
import { type ChangeEvent, useRef } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { SelectedSubjects } from '@/types/pensum'

function isValidSelectedSubjects(data: unknown): data is SelectedSubjects {
	if (typeof data !== 'object' || data === null || Array.isArray(data))
		return false
	return Object.values(data).every(
		(subjects) =>
			Array.isArray(subjects) &&
			subjects.every(
				(s) =>
					typeof s === 'object' &&
					s !== null &&
					typeof s.code === 'string' &&
					typeof s.name === 'string' &&
					typeof s.credits === 'number' &&
					Array.isArray(s.prerequisites) &&
					s.prerequisites.every((p: unknown) => typeof p === 'string'),
			),
	)
}

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
					alert('El archivo no tiene el formato esperado')
					return
				}
				importFromFile(parsed)
			} catch {
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
					onClick={exportToFile}
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
