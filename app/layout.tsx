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
import { GoogleAnalytics } from '@next/third-parties/google'
import { cn } from '@/lib/utils'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	metadataBase: new URL('https://unapec-pensum-tracker.vercel.app'),
	title: 'UNAPEC Pensum Tracker',
	description: 'Seguimiento de asignaturas para UNAPEC',
	alternates: {
		canonical: '/',
	},
	keywords: [
		'tracker',
		'university',
		'universidad',
		'dominican',
		'dominican-republic',
		'apec',
		'unapec',
		'dominican-developers',
		'pensum',
		'currículo',
		'carrera',
		'asignaturas',
		'materias',
		'república dominicana',
		'seguimiento académico',
	],
	manifest: `${base}/manifest.webmanifest`,
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Pensum',
	},
	icons: {
		icon: `${base}/favicon.ico`,
		apple: `${base}/apple-touch-icon.png`,
	},
	openGraph: {
		type: 'website',
		siteName: 'UNAPEC Pensum Tracker',
		title: 'UNAPEC Pensum Tracker',
		description: 'Seguimiento de asignaturas para UNAPEC',
		url: '/',
		images: [{ url: '/og-image.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'UNAPEC Pensum Tracker',
		description: 'Seguimiento de asignaturas para UNAPEC',
		images: ['/og-image.png'],
	},
	verification: {
		google: 'oKo_Rkul7dgVxokF_SMRD5etuJTncr2brh8c8stLg5Q',
	},
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
			<GoogleAnalytics gaId="G-XG7025ZTVJ" />
		</html>
	)
}
