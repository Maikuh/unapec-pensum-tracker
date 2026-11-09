'use client'

import { RotateCcw } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ResetProgressButtonProps {
	disabled?: boolean
	onConfirm: () => void
}

export function ResetProgressButton({
	disabled,
	onConfirm,
}: ResetProgressButtonProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						disabled={disabled}
						className="text-muted-foreground"
					/>
				}
			>
				<RotateCcw className="h-4 w-4 mr-2" />
				Reiniciar progreso
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Reiniciar progreso?</AlertDialogTitle>
					<AlertDialogDescription>
						Se desmarcarán todas las materias de este pensum. Tu progreso en
						otras carreras no se verá afectado. Puedes exportar tus datos antes
						para tener un respaldo.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onConfirm}>
						Reiniciar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
