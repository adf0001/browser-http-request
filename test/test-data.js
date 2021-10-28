// global, for html page
browser_http_request = require("../browser-http-request.js");

module.exports = {

	"browser_http_request()": function (done) {
		browser_http_request('http://myip.ipip.net', 'GET', '', null,
			function (error, data) {
				console.log(error, data);
				if (data && data.headers)
					console.log(browser_http_request.parseHeaders(data.headers));	//.parseHeaders() tool
				done(error && !error.error);
			}
		);
	},
	".requestJson()": function (done) {
		browser_http_request.requestJson('http://myip.ipip.net/json', 'GET', '', null,
			function (error, data) {
				console.log(error, data);
				if (data && data.headers)
					console.log(browser_http_request.parseHeaders(data.headers));	//.parseHeaders() tool
				done(error && !error.error);
			}
		);
	},
};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () {
	for (var i in module.exports) {
		it(i, module.exports[i]).timeout(15000);	//timeout 15s for web request
	}
});
