import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './table'

function SimpleTable() {
	return (
		<Table>
			<TableCaption>Grades</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Subject</TableHead>
					<TableHead>Grade</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Math</TableCell>
					<TableCell>90</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>Total</TableCell>
					<TableCell>1</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}

describe('Table — contract', () => {
	it('renders the caption', () => {
		render(<SimpleTable />)
		expect(screen.getByText('Grades')).toBeVisible()
	})

	it('renders column headers', () => {
		render(<SimpleTable />)
		expect(screen.getByRole('columnheader', { name: 'Subject' })).toBeVisible()
		expect(screen.getByRole('columnheader', { name: 'Grade' })).toBeVisible()
	})

	it('renders body cells', () => {
		render(<SimpleTable />)
		expect(screen.getByRole('cell', { name: 'Math' })).toBeVisible()
		expect(screen.getByRole('cell', { name: '90' })).toBeVisible()
	})

	it('renders a footer row', () => {
		render(<SimpleTable />)
		expect(screen.getByText('Total')).toBeVisible()
	})
})
