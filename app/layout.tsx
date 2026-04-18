import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import { BackToTop } from '@/components/back-to-top'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { StoreInitializer } from '@/components/store-initializer'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'
import { cn } from '@/lib/utils'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'UNAPEC Pensum Tracker',
	description: 'Seguimiento de asignaturas para UNAPEC',
	manifest: `${base}/manifest.webmanifest`,
	appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Pensum' },
	icons: { apple: `${base}/apple-touch-icon.png` },
}

export const viewport: Viewport = {
	themeColor: '#09090b',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="es"
			suppressHydrationWarning
			className={cn(
				'h-full',
				'antialiased',
				geistMono.variable,
				'font-sans',
				inter.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<TooltipProvider>
						<StoreInitializer />
						<ServiceWorkerRegister />
						<Navbar />
						<main className="flex-1 container mx-auto px-4 py-8">
							{children}
						</main>
						<Footer />
						<BackToTop />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
