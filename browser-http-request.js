
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
// callback: function( error:{ error, data.* }, data:{ responseText, statusCode, statusMessage, headers, userData } )
var requestText = function (url, methodOrOptions, postData, headers, callback, userData) {
	//options
	var options = (typeof methodOrOptions === "string") ? { method: methodOrOptions } : (methodOrOptions || {});

	if (!options.headers) {
		if (headers) options.headers = headers;
		else if (options.method === "POST") options.headers =
			{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	}

	//timer & cleanup
	var tmid;
	var cleanup = function () {
		if (tmid) { clearTimeout(tmid); tmid = null; };
		callback = null; 	//call only once
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
			if (!callback) return;

			var headerText = xq.getAllResponseHeaders();

			var resData = {
				responseText: xq.responseText,
				statusCode: xq.status,
				statusMessage: xq.statusText,
				headerText: headerText,
				headers: parseHeaders(headerText),
				userData: userData,
			};

			if (xq.status == 200) {
				callback(null, resData);
			}
			else {
				resData.error = xq.status + " " + xq.statusText;
				callback(resData);
			}
		}
		lastReadyState = xq.readyState;
	}

	if (options.timeout > 0) {		//waiting timeout
		tmid = setTimeout(function () {
			if (callback) { callback({ error: "timeout, " + options.timeout, userData: userData }); }
			tmid = null;
			cleanup();
			xq.abort();
		}, options.timeout)
	}

	return xq.send(postData);
}

// callback: function( error:{ error, data.* }, data:{ responseJson, data.* from requestText() } )
var requestJson = function (url, methodOrOptions, postData, headers, callback, userData) {
	requestText(url, methodOrOptions, postData, headers, function (error, data) {
		if (error) { if (callback) callback(error, data); return; }

		try { data.responseJson = JSON.parse(data.responseText); }
		catch (ex) { console.log(ex); data.responseJson = null; }

		if (callback) callback(error, data);
	}, userData);
}

//module

module.exports = exports = requestText;

exports.requestText = requestText;
exports.requestJson = requestJson;
exports.parseHeaders = parseHeaders;
