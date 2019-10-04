import {Buffer} from "buffer";

/**
 * Разбиение массива Uint8Array по делителю, который тоже представлен как Uint8Array.
 * На выходе создается массив из элементов типа Uint8Array.
 * Используется пакет `feross/buffer`, который реализует класс Buffer из NodeJS для браузеров.
 * @link https://github.com/feross/buffer
 */
export default function uint8ArraySplit(source: Uint8Array, splitter: Uint8Array): Uint8Array[] {
	const result: Uint8Array[] = [];

	const splitterBuffer = Buffer.from(splitter);
	let sourceBuffer = Buffer.from(source);

	let splitterIndex;
	do {
		splitterIndex = sourceBuffer.indexOf(splitterBuffer);
		if (splitterIndex === -1) {
			result.push(sourceBuffer);
		} else {
			result.push(sourceBuffer.slice(0, splitterIndex));
			sourceBuffer = sourceBuffer.slice(splitterIndex + splitterBuffer.length);
		}
	} while (splitterIndex !== -1);

	return result;
}