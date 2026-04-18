const ROMAN_VALS: [number, string][] = [
	[1000, 'M'],
	[900, 'CM'],
	[500, 'D'],
	[400, 'CD'],
	[100, 'C'],
	[90, 'XC'],
	[50, 'L'],
	[40, 'XL'],
	[10, 'X'],
	[9, 'IX'],
	[5, 'V'],
	[4, 'IV'],
	[1, 'I'],
]

export function toRoman(n: number): string {
	let result = ''
	let remaining = n
	for (const [val, sym] of ROMAN_VALS) {
		while (remaining >= val) {
			result += sym
			remaining -= val
		}
	}
	return result
}
