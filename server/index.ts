import Express from 'express';
import FormData from 'form-data';
import Cors from 'cors';

const app = Express();

app.use(Cors());

app.get('/multipart-sample-body', (req, res, next) => {
	const form = new FormData();
	form.append('file1', 'Содержимое файла 1', {contentType: 'text/plain'});
	form.append('file2', 'Содержимое файла 2', {contentType: 'text/plain'});
	form.append('file3', 'Содержимое файла 3', {contentType: 'text/plain'});
	res.set(form.getHeaders());
	form.pipe(res);
});

const port = 5050;
app.listen(port, function () {
	console.log(`> Send GET request 'http://localhost:${port}/multipart-sample-body'.`);
	console.log(`> Listening on port ${port}.`);
});