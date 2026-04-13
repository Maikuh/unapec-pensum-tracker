'use client'

import { ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
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
import type { Pensum } from '@/types/pensum'

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

	function handleSelect(pensumCode: string) {
		setValue(pensumCode)
		setOpen(false)
		router.push(`/pensums/${pensumCode}`)
	}

	const selected = pensums.find((p) => p.pensumCode === value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-expanded={open}
				aria-label="Seleccionar carrera"
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
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
