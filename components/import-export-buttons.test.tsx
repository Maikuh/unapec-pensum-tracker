import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import { renderWithTooltip } from '@/test/utils'
import type { SelectedSubjects } from '@/types'
import { ImportExportButtons } from './import-export-buttons'

const VALID_DATA: SelectedSubjects = {
	ADMR11: [
		{
			code: 'MAT010',
			name: 'Matemáticas I',
			credits: 4,
			prerequisites: [],
		},
	],
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
})

describe('ImportExportButtons — rendering', () => {
	it('renders export and import buttons', () => {
		renderWithTooltip(<ImportExportButtons />)
		expect(screen.getByLabelText('Exportar datos a archivo')).toBeVisible()
		expect(screen.getByLabelText('Importar datos de archivo')).toBeVisible()
	})
})

describe('ImportExportButtons — export', () => {
	it('shows tooltip on export button hover', async () => {
		renderWithTooltip(<ImportExportButtons />)
		await userEvent.hover(screen.getByLabelText('Exportar datos a archivo'))
		expect(await screen.findByText('Exportar datos')).toBeVisible()
	})
})

describe('ImportExportButtons — import', () => {
	it('calls importFromFile and updates store with valid JSON', async () => {
		renderWithTooltip(<ImportExportButtons />)
		const input = document.querySelector('input[type=file]') as HTMLInputElement
		await userEvent.upload(
			input,
			new File([JSON.stringify(VALID_DATA)], 'uptracker.json', {
				type: 'application/json',
			}),
		)
		await waitFor(() => {
			expect(useSelectedSubjectsStore.getState().selectedSubjects).toEqual(
				VALID_DATA,
			)
		})
	})

	it('shows alert for non-JSON file type', async () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
		renderWithTooltip(<ImportExportButtons />)
		const input = document.querySelector('input[type=file]') as HTMLInputElement
		const user = userEvent.setup({ applyAccept: false })
		await user.upload(
			input,
			new File(['hello'], 'test.txt', { type: 'text/plain' }),
		)
		expect(alertSpy).toHaveBeenCalledWith(
			'Por favor seleccione un archivo JSON válido',
		)
	})

	it('shows alert for malformed JSON', async () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
		renderWithTooltip(<ImportExportButtons />)
		const input = document.querySelector('input[type=file]') as HTMLInputElement
		await userEvent.upload(
			input,
			new File(['{ not valid json }'], 'bad.json', {
				type: 'application/json',
			}),
		)
		await waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith('El archivo no es un JSON válido')
		})
	})

	it('shows alert when JSON does not match expected structure', async () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
		renderWithTooltip(<ImportExportButtons />)
		const input = document.querySelector('input[type=file]') as HTMLInputElement
		await userEvent.upload(
			input,
			new File([JSON.stringify({ wrong: 'structure' })], 'bad-shape.json', {
				type: 'application/json',
			}),
		)
		await waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith(
				'El archivo no tiene el formato esperado',
			)
		})
	})
})
