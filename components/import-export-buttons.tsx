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
				const data = JSON.parse(
					event.target?.result as string,
				) as SelectedSubjects
				importFromFile(data)
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
