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
	callback: function( Error:{ data.* }, data:{ responseText, statusCode, statusMessage, headers, userData } )
*/
browser_http_request('http://url', 'GET', '', null,
	function (error, data) {
		console.log(error, data);
	}
);

//	callback: function( Error:{ data.* }, data:{ responseJson, data.* from requestText() } )
browser_http_request.requestJson('http://url/json', 'GET', '', null,		//add responseJson to data
	function (error, data) {
		console.log(error, data);
	}
);

//	callback: function( error, data:responseText )
browser_http_request.text('http://url', 'GET', '', null,		//wrap just text as data
	function (error, data) {
		console.log(error, data);
	}
);

//	callback: function( error, data:responseJson )
browser_http_request.json('http://url/json', 'GET', '', null,		//wrap just json as data
	function (error, data) {
		console.log(error, data);
	}
);

```
