import uint8ArraySplit from './uint8ArraySplit';
import {string2Uint8Array} from './uint8ArrayUtils';

const EOL = '\r\n';

/**
 * Набор разделителей Multipart-содержимого.
 */
interface IBoundarySet {
	start: Uint8Array;
	middle: Uint8Array;
	end: Uint8Array;
}

/**
 * Ошибки, которые происходят в процессе разбора Multipart-ответа сервера.
 */
export class ParseMultipartError extends Error {}

/**
 * Разбор ответа сервера.
 * @param response
 */
export async function parseMultipartFromResponse(response: Response): Promise<Uint8Array[]> {
	if (!isMultipart(response)) throw new ParseMultipartError('Ответ сервера должен быть multipart/form-data.');
	const contentType = response.headers.get('Content-Type');
	if (!contentType) throw new ParseMultipartError('В ответе сервера ожидается заголовок Content-Type.');
	const boundary = getBoundaryFromContentType(contentType);
	return parseMultipart(boundary, new Uint8Array(await response.arrayBuffer()));
}

/**
 * Проверка, является ли ответ сервера Multipart.
 * @param response
 */
export function isMultipart(response: Response) {
	const contentType = response.headers.get('Content-Type');
	if (!contentType) throw new Error('В ответе сервера ожидается заголовок Content-Type.');
	return contentType.indexOf('multipart/form-data') === 0;
}

/**
 * Выделить разделитель Multipart-файла (boundary) из HTTP-заголовка Content-Type.
 * Формат строки contentType выглядит следующим образом: multipart/form-data; boundary=<Строка разделителя>.
 * Функция возвращает строки разделителя в виде Uint8Array для трех случаев: начало, середина и конец файла.
 */
function getBoundaryFromContentType(contentType: string): IBoundarySet {
	const boundary: string = '--' + contentType.split(';')[1].split('=')[1];
	return {
		start: string2Uint8Array(boundary + EOL),
		middle: string2Uint8Array(EOL + boundary + EOL),
		end: string2Uint8Array(EOL + boundary + '--')
	};
}

/**
 * Разбор массива data, содержащего файл в формате Multipart.
 * На выходе массив с частями файла. Внимание, каждая часть содержит в себе свои HTTP-заголовки и содержимое.
 */
function parseMultipart(boundary: IBoundarySet, data: Uint8Array): Uint8Array[] {
	let dataWithoutEndBoundary: Uint8Array = uint8ArraySplit(data, boundary.end)[0];
	let result: Uint8Array[] = uint8ArraySplit(dataWithoutEndBoundary, boundary.middle);
	result[0] = uint8ArraySplit(result[0], boundary.start)[1];
	return result;
}