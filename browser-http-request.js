
// browser-http-request @ npm
// enclose browser XMLHttpRequest for callback function

//parse headers string tool
var parseHeaders = function (headerText) {
	if (typeof headerText !== "string") return headerText;

	var headers = {}, i;
	headerText.trim().split(/[\r\n]\s*/).map(
		function (v) {
			i = v.indexOf(":");
			if (i > 0) headers[v.slice(0, i).trim()] = v.slice(i + 1).trim();
		}
	);
	return headers;
}

// methodOrOptions: string "POST"/"GET"/..., or user-defined options { method, headers:{}, timeout }
// callback: function( Error:{ data.* }, data:{ responseText, statusCode, statusMessage, headers, userData } )
// return the XMLHttpRequest object
var requestText = function (url, methodOrOptions, postData, headers, callback, userData) {
	//options
	var options = (typeof methodOrOptions === "string") ? { method: methodOrOptions } : (methodOrOptions || {});

	if (!options.headers) {
		if (headers) options.headers = headers;
		else if (options.method === "POST") options.headers =
			{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	}

	//cleanup
	var tmid;
	var cleanup = function () {
		if (tmid) { clearTimeout(tmid); tmid = null; };
		callback = null; 	//callback only once
	}

	//xq
	var xq = new XMLHttpRequest();

	xq.open(options.method, url, true);
	if (options.headers) {
		for (var i in options.headers) { xq.setRequestHeader(i, options.headers[i]); }
	}

	var lastReadyState = 0;
	xq.onreadystatechange = function () {
		if (xq.readyState === 4 || (xq.readyState === 0 && lastReadyState)) {	//DONE, or UNSENT by abort
			if (callback) {
				var headerText = xq.getAllResponseHeaders();

				var resData = {
					responseText: xq.responseText,
					statusCode: xq.status,
					statusMessage: xq.statusText,
					headerText: headerText,
					headers: parseHeaders(headerText),
				};
				if (userData) resData.userData = userData;

				if (xq.status == 200) {
					callback(null, resData);
				}
				else {
					var err = Error(xq.status + " " + xq.statusText +
						(xq.responseText ? (", " + xq.responseText.slice(0, 255)) : ""));
					for (var i in resData) err[i] = resData[i];
					callback(err);
				}
			}
			cleanup();
		}
		lastReadyState = xq.readyState;
	}

	if (options.timeout > 0) {		//waiting timeout
		tmid = setTimeout(function () {
			if (callback) {
				var err = Error("timeout, " + options.timeout);
				if (userData) err.userData = userData;
				callback(err);
			}
			tmid = null;
			cleanup();
			xq.abort();
		}, options.timeout)
	}

	xq.send(postData);

	return xq;
}

// callback: function( Error:{ data.* }, data:{ responseJson, data.* from requestText() } )
var requestJson = function (url, methodOrOptions, postData, headers, callback, userData) {
	return requestText(url, methodOrOptions, postData, headers, function (error, data) {
		if (!error) {
			try { data.responseJson = JSON.parse(data.responseText); }
			catch (ex) {
				console.log(ex);
				error = Error("JSON parse error, " + ex.message);
				for (var i in data) error[i] = data[i];
			}
		}
		callback && callback(error, data);
	}, userData);
}

// callback: function( error, data:responseText )
var _text = function (url, methodOrOptions, postData, headers, callback, userData) {
	return requestText(url, methodOrOptions, postData, headers, function (error, data) {
		callback && callback(error, error ? data : data.responseText);
	}, userData);
}

// callback: function( error, data:responseJson )
var _json = function (url, methodOrOptions, postData, headers, callback, userData) {
	return requestJson(url, methodOrOptions, postData, headers, function (error, data) {
		callback && callback(error, error ? data : data.responseJson);
	}, userData);
}

//module

module.exports = exports = requestText;

exports.requestText = requestText;
exports.requestJson = requestJson;
exports.text = _text;
exports.json = _json;

exports.parseHeaders = parseHeaders;
