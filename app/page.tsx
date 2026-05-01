export default function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
			<h1 className="text-4xl font-bold tracking-tight">
				<span className="text-primary">UNAPEC</span> Pensum Tracker
			</h1>
			<p className="text-muted-foreground text-lg max-w-md">
				Selecciona tu carrera en la barra de navegación para comenzar a
				registrar las asignaturas que has cursado.
			</p>
		</div>
	)
}
