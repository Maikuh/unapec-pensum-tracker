import { describe, expect, it } from 'vitest'
import { toRoman } from './to-roman'

describe('toRoman', () => {
	it.each([
		[1, 'I'],
		[2, 'II'],
		[3, 'III'],
		[4, 'IV'],
		[5, 'V'],
		[9, 'IX'],
		[10, 'X'],
		[14, 'XIV'],
		[40, 'XL'],
		[50, 'L'],
		[90, 'XC'],
		[100, 'C'],
		[400, 'CD'],
		[500, 'D'],
		[900, 'CM'],
		[1000, 'M'],
		[1994, 'MCMXCIV'],
		[2024, 'MMXXIV'],
	])('converts %i to %s', (n, expected) => {
		expect(toRoman(n)).toBe(expected)
	})
})
