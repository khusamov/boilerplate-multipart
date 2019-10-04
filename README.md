Multipart Parsing
=================

Обработка (парсинг) Multipart-ответа сервера в браузере. Написан на ReactJS.

Запуск примера:

```
yarn
yarn start:server
yarn start:client
```


Ссылки
------

Краткое описание `multipart/form-data`, скрипт формирования multipart на PHP, 
описание как сформировать multipart-запрос из браузера:  
https://learn.javascript.ru/xhr-forms

Составление запроса с multipart-содержимым:  
https://habr.com/ru/sandbox/103022/

Спецификация `multipart/form-data`:  
https://tools.ietf.org/html/rfc7578

Пример multipart
----------------

```
POST /form.html HTTP/1.1
Host: server.com
Referer: http://server.com/form.html
User-Agent: Mozilla
Content-Type: multipart/form-data; boundary=-------------573cf973d5228
Content-Length: 288
Connection: keep-alive
Keep-Alive: 300
(пустая строка)
(отсутствующая преамбула)
---------------573cf973d5228
Content-Disposition: form-data; name="field"

text
---------------573cf973d5228
Content-Disposition: form-data; name="file"; filename="sample.txt"
Content-Type: text/plain

Content file
---------------573cf973d5228--
```