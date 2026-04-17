import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

interface RenderWithThemeOptions extends Omit<RenderOptions, 'wrapper'> {
	defaultTheme?: 'light' | 'dark'
}

export function renderWithTheme(
	ui: ReactElement,
	opts?: RenderWithThemeOptions,
) {
	const { defaultTheme = 'light', ...rest } = opts ?? {}
	return render(ui, {
		wrapper: ({ children }) => (
			<ThemeProvider
				attribute="class"
				defaultTheme={defaultTheme}
				enableSystem={false}
			>
				{children}
			</ThemeProvider>
		),
		...rest,
	})
}

export function renderWithTooltip(
	ui: ReactElement,
	opts?: Omit<RenderOptions, 'wrapper'>,
) {
	return render(ui, {
		wrapper: ({ children }) => <TooltipProvider>{children}</TooltipProvider>,
		...opts,
	})
}
