import React, {Component} from 'react';
import './App.scss';
import {uint8Array2String} from './uint8ArrayUtils';
import {parseMultipartFromResponse} from './parseMultipart';

type TMultipartRequestStatus = 'idle' | 'fetch' | 'success' | 'failure';

interface IAppState {
	multipartRequestStatus: TMultipartRequestStatus;
	multipartRequestResult: string[][];
}

/**
 * Пример разбора Multipart-ответа сервера.
 */
export default class App extends Component<{}, IAppState> {
	private static getStatusMessage(status: TMultipartRequestStatus): string {
		return (
			{
				idle: 'Ожидание',
				fetch: 'Запрос отправлен...',
				success: 'Получен успешный ответ',
				failure: 'Получен ответ с ошибкой'
			}[status] || status
		);
	}

	state: IAppState = {
		multipartRequestStatus: 'idle',
		multipartRequestResult: []
	};

	async componentDidMount() {
		this.setState({multipartRequestStatus: 'fetch'});
		const response = await fetch('http://localhost:5050/multipart-sample-body');
		this.setState({multipartRequestStatus: response.ok ? 'success' : 'failure'});
		if (response.ok) {
			const parts = await parseMultipartFromResponse(response);
			const partsAsStringArray = parts.map(item => uint8Array2String(item).split('\n'));
			this.setState({multipartRequestResult: partsAsStringArray});
			console.group('Части файла в виде текста');
			console.log(partsAsStringArray);
			console.groupEnd();
		}
	}

	render() {
		const {
			multipartRequestStatus: status,
			multipartRequestResult: result
		} = this.state;
		return (
			<div className='App'>
				<p>Статус запроса: {App.getStatusMessage(status)}</p>
				{
					status === 'success' && !!result.length && (
						this.renderMultipartRequestResult(result)
					)
				}
			</div>
		);
	}

	renderMultipartRequestResult(result: string[][]) {
		return (
			<div>
				<p>Ответ сервера:</p>
				{
					result.map((part, index) => (
						<div key={index} style={{marginBottom: 20}}>
							<div><b>Часть {index + 1}:</b></div>
							{
								part
									.map(line => (line === '' ? '--' : line))
									.map((line, index) => <div key={index}>{line}</div>)
							}
						</div>
					))
				}
			</div>
		);
	}
}