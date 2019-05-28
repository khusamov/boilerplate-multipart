import React, {Component} from 'react';
import './App.scss';
import {Buffer} from 'buffer';
import {TextEncoder, TextDecoder} from 'text-encoding-shim';

interface IBoundarySet {
	start: Uint8Array;
	middle: Uint8Array;
	end: Uint8Array;
}

export default class App extends Component {
	constructor(props: {}) {
		super(props);
		App.fetchMultipartSample();
	}

	render() {
		return (
			<div className='App'>
				Смотрите консоль браузера.
			</div>
		);
	}

	private static EOL = '\r\n';

	/**
	 * Пример разбора Multipart-ответа сервера.
	 */
	private static async fetchMultipartSample() {
		const response = await fetch('http://localhost:5050/multipart-sample-body');
		const parts = await App.parseMultipartFromResponse(response);
		const partsAsStringArray = parts.map(item => App.uint8Array2String(item));
		console.group('Части файла в виде текста');
		console.log(partsAsStringArray);
		console.groupEnd();
	}

	private static async parseMultipartFromResponse(response: Response) {
		const contentType = response.headers.get('Content-Type');
		if (!contentType) throw new Error('Ожидается заголовок Content-Type');
		return App.parseMultipart(contentType, new Uint8Array(await response.arrayBuffer()));
	}

	private static parseMultipart(contentType: string, data: Uint8Array) {
		const boundary = App.getBoundaryFromContentType(contentType);
		return App.parseMultipartData(boundary, data);
	}

	/**
	 * Разбиение массива по делителю.
	 * Используется Buffer от feross.
	 * @link https://github.com/feross/buffer
	 */
	private static uint8ArraySplit(source: Uint8Array, splitter: Uint8Array): Uint8Array[] {
		const result = [];
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

	/**
	 * Выделить разделитель Multipart-файла из HTTP-заголовка Content-Type.
	 * Формат строки: multipart/form-data; boundary=<Строка разделителя>.
	 * Функция возвращает строки разделителя в виде Uint8Array для трех случаев: начало, середина и конец файла.
	 * @param contentType
	 */
	private static getBoundaryFromContentType(contentType: string): IBoundarySet {
		const EOL = App.EOL;
		const boundary: string = '--' + contentType.split(';')[1].split('=')[1];
		return {
			start: App.string2Uint8Array(boundary + EOL),
			middle: App.string2Uint8Array(EOL + boundary + EOL),
			end: App.string2Uint8Array(EOL + boundary + '--')
		};
	}

	/**
	 * Конвертация строки в массив.
	 */
	private static string2Uint8Array(str: string): Uint8Array {
		return new TextEncoder().encode(str);
	}

	/**
	 * Конвертация массива в строку.
	 */
	private static uint8Array2String(arr: Uint8Array, encoding = 'utf-8') {
		return new TextDecoder(encoding).decode(arr);
	}

	/**
	 * Разбор массива data, содержащего файл в формате Multipart.
	 * На выходе массив с частями файла. Заголовки в частях отделять следует отдельно.
	 * @param boundary Разделитель.
	 * @param data Данные.
	 */
	private static parseMultipartData(boundary: IBoundarySet, data: Uint8Array): Uint8Array[] {
		let dataWithoutEndBoundary: Uint8Array = App.uint8ArraySplit(data, boundary.end)[0];
		let result: Uint8Array[] = App.uint8ArraySplit(dataWithoutEndBoundary, boundary.middle);
		result[0] = App.uint8ArraySplit(result[0], boundary.start)[1];
		return result;
	}
}