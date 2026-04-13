import { Separator } from '@/components/ui/separator'

export function Footer() {
	return (
		<div className="mt-8 mb-6 px-4">
			<Separator className="mb-6" />
			<footer className="text-center text-sm text-muted-foreground">
				&copy;&nbsp;
				<a
					href="https://github.com/maikuh"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-foreground"
				>
					Maikuh
				</a>
			</footer>
		</div>
	)
}
