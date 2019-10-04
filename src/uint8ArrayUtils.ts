import {TextEncoder, TextDecoder} from 'text-encoding-shim';

/**
 * Конвертация строки в массив Uint8Array.
 */
export function string2Uint8Array(str: string): Uint8Array {
	return new TextEncoder().encode(str);
}

/**
 * Конвертация массива Uint8Array в строку.
 */
export function uint8Array2String(arr: Uint8Array, encoding = 'utf-8') {
	return new TextDecoder(encoding).decode(arr);
}