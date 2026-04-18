import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const publicDir = join(import.meta.dir, '..', 'public')
const iconsDir = join(publicDir, 'icons')

mkdirSync(iconsDir, { recursive: true })

const svgBuffer = readFileSync(join(publicDir, 'logo.svg'))
const bg = { r: 9, g: 9, b: 11, alpha: 1 } // #09090b — matches dark theme

const sizes = [192, 512] as const

for (const size of sizes) {
	await sharp(svgBuffer)
		.resize(size, size)
		.png()
		.toFile(join(iconsDir, `icon-${size}.png`))
	console.log(`icon-${size}.png`)

	const innerSize = Math.round(size * 0.8)
	const offset = Math.round((size - innerSize) / 2)
	const logoResized = await sharp(svgBuffer)
		.resize(innerSize, innerSize)
		.png()
		.toBuffer()

	await sharp({
		create: { width: size, height: size, channels: 4, background: bg },
	})
		.composite([{ input: logoResized, top: offset, left: offset }])
		.png()
		.toFile(join(iconsDir, `icon-maskable-${size}.png`))
	console.log(`icon-maskable-${size}.png`)
}

await sharp(svgBuffer)
	.resize(180, 180)
	.png()
	.toFile(join(publicDir, 'apple-touch-icon.png'))
console.log('apple-touch-icon.png')
