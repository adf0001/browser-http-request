# browser-http-request
enclose browser XMLHttpRequest for callback function

# Install
```
npm install browser-http-request
```

# Usage & Api
```javascript
var browser_http_request= require("browser-http-request");

/*
requestText = function (url, methodOrOptions, postData, headers, callback, userData)		//default
	methodOrOptions: string "POST"/"GET"/..., or user-defined options { method, headers:{}, timeout }
	callback: function( error:{ error, data.* }, data:{ responseText, statusCode, statusMessage, headers, userData } )
*/
browser_http_request('http://url', 'GET', '', null,
	function (error, data) {
		console.log(error, data);
		if (data && data.headers)
			console.log(browser_http_request.parseHeaders(data.headers));	//.parseHeaders() tool
	}
);

/*
requestJson = function (url, methodOrOptions, postData, headers, callback, userData)
	callback: function( error:{ error, data.* }, data:{ responseJson, data.* from requestText() } )
*/
browser_http_request.requestJson('http://url/json', 'GET', '', null,
	function (error, data) {
		console.log(error, data);
		if (data && data.headers)
			console.log(browser_http_request.parseHeaders(data.headers));	//.parseHeaders() tool
	}
);

```
