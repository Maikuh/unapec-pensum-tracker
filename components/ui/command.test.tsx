import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from './command'

function FruitCommand({
	onSelect = vi.fn(),
}: {
	onSelect?: (v: string) => void
}) {
	return (
		<Command>
			<CommandInput placeholder="Search fruit…" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					<CommandItem onSelect={() => onSelect('apple')}>Apple</CommandItem>
					<CommandItem onSelect={() => onSelect('banana')}>Banana</CommandItem>
					<CommandItem onSelect={() => onSelect('cherry')}>Cherry</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	)
}

describe('Command — rendering', () => {
	it('renders all items initially', () => {
		render(<FruitCommand />)
		expect(screen.getByText('Apple')).toBeVisible()
		expect(screen.getByText('Banana')).toBeVisible()
		expect(screen.getByText('Cherry')).toBeVisible()
	})

	it('renders the search input with its placeholder', () => {
		render(<FruitCommand />)
		expect(screen.getByPlaceholderText('Search fruit…')).toBeVisible()
	})
})

describe('Command — filtering', () => {
	it('filters items as the user types', async () => {
		render(<FruitCommand />)
		await userEvent.type(screen.getByPlaceholderText('Search fruit…'), 'ban')
		expect(screen.getByText('Banana')).toBeVisible()
		expect(screen.queryByText('Apple')).not.toBeInTheDocument()
		expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
	})

	it('shows CommandEmpty when no items match the query', async () => {
		render(<FruitCommand />)
		await userEvent.type(screen.getByPlaceholderText('Search fruit…'), 'zzz')
		expect(await screen.findByText('No results found.')).toBeVisible()
	})
})

describe('CommandSeparator and CommandShortcut', () => {
	it('renders a separator between groups and a shortcut inside an item', () => {
		render(
			<Command>
				<CommandList>
					<CommandGroup>
						<CommandItem>
							Open
							<CommandShortcut>⌘O</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup>
						<CommandItem>Quit</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)
		expect(screen.getByText('⌘O')).toBeVisible()
		expect(screen.getByText('Quit')).toBeVisible()
	})
})

describe('CommandDialog', () => {
	it('renders command content inside a dialog when open', async () => {
		render(
			<CommandDialog open onOpenChange={() => {}}>
				<Command>
					<CommandList>
						<CommandGroup>
							<CommandItem>Dialog option</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>,
		)
		expect(await screen.findByText('Dialog option')).toBeVisible()
	})

	it('does not render content when closed', () => {
		render(
			<CommandDialog open={false} onOpenChange={() => {}}>
				<Command>
					<CommandList>
						<CommandItem>Hidden</CommandItem>
					</CommandList>
				</Command>
			</CommandDialog>,
		)
		expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
	})
})

describe('Command — interaction', () => {
	it('fires onSelect when an item is clicked', async () => {
		const onSelect = vi.fn()
		render(<FruitCommand onSelect={onSelect} />)
		await userEvent.click(screen.getByText('Apple'))
		expect(onSelect).toHaveBeenCalledWith('apple')
	})

	it('fires onSelect when Enter is pressed on the highlighted item', async () => {
		const onSelect = vi.fn()
		render(<FruitCommand onSelect={onSelect} />)
		const input = screen.getByPlaceholderText('Search fruit…')
		await userEvent.click(input)
		await userEvent.keyboard('{ArrowDown}{Enter}')
		expect(onSelect).toHaveBeenCalledOnce()
	})
})
