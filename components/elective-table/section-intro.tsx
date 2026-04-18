import type React from 'react'

type DescItem = { type: 'p' | 'li'; text: string }

interface SectionIntroProps {
	items: DescItem[]
}

export function SectionIntro({ items }: SectionIntroProps) {
	return (
		<div className="text-sm text-muted-foreground space-y-1.5">
			{renderDescItems(items)}
		</div>
	)
}

export function renderDescItems(items: DescItem[]): React.ReactNode[] {
	const nodes: React.ReactNode[] = []
	let bullets: string[] = []

	for (const item of items) {
		if (item.type === 'li') {
			bullets.push(item.text)
		} else {
			if (bullets.length > 0) {
				nodes.push(
					<ul
						key={`ul-${nodes.length}`}
						className="list-disc list-inside space-y-0.5"
					>
						{bullets.map((b) => (
							<li key={b}>{b}</li>
						))}
					</ul>,
				)
				bullets = []
			}
			nodes.push(<p key={item.text}>{item.text}</p>)
		}
	}

	if (bullets.length > 0) {
		nodes.push(
			<ul
				key={`ul-${nodes.length}`}
				className="list-disc list-inside space-y-0.5"
			>
				{bullets.map((b) => (
					<li key={b}>{b}</li>
				))}
			</ul>,
		)
	}

	return nodes
}
