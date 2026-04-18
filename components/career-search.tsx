'use client'

import { ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Pensum } from '@/types'

interface CareerSearchProps {
	pensums: Pick<Pensum, 'pensumCode' | 'carreerName'>[]
	className?: string
}

export function CareerSearch({ pensums, className }: CareerSearchProps) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const router = useRouter()
	const pathname = usePathname()

	// Sync selected value with current URL
	useEffect(() => {
		const match = pathname.match(/^\/pensums\/([^/]+)$/)
		setValue(match ? match[1] : '')
	}, [pathname])

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((prev) => !prev)
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	function handleSelect(pensumCode: string) {
		const pensum = pensums.find((p) => p.pensumCode === pensumCode)
		posthog.capture('career_selected', {
			pensum_code: pensumCode,
			career_name: pensum?.carreerName,
		})
		setValue(pensumCode)
		setOpen(false)
		router.push(`/pensums/${pensumCode}`)
	}

	const selected = pensums.find((p) => p.pensumCode === value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-expanded={open}
				data-testid="career-search-trigger"
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'w-full justify-between text-left font-normal',
					className,
				)}
			>
				<span className="truncate">
					{selected
						? `${selected.pensumCode} - ${selected.carreerName}`
						: 'Selecciona una carrera...'}
				</span>
				<span className="ml-2 flex shrink-0 items-center gap-1.5">
					{!selected && (
						<kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
							⌘K
						</kbd>
					)}
					<ChevronsUpDown className="h-4 w-4 opacity-50" />
				</span>
			</PopoverTrigger>
			<PopoverContent className="w-(--anchor-width) p-0" align="start">
				<Command>
					<CommandInput
						placeholder="Buscar carrera..."
						data-testid="career-search-input"
					/>
					<CommandList>
						<CommandEmpty>No se encontró ninguna carrera.</CommandEmpty>
						<CommandGroup>
							{pensums.map((pensum) => (
								<CommandItem
									key={pensum.pensumCode}
									value={`${pensum.pensumCode} ${pensum.carreerName}`}
									onSelect={() => handleSelect(pensum.pensumCode)}
									data-checked={value === pensum.pensumCode}
									data-testid="career-search-option"
								>
									{pensum.pensumCode} - {pensum.carreerName}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
