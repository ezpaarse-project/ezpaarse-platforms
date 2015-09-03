'use strict';

var bacon  = require('../../.lib/bacon-scraper.js');
var request     = require('request').defaults({
  jar: true, //to accept the cookie, without which we don't have access to the correct content
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
  // proxy: 'http://proxyout.inist.fr:8080'
});



bacon.generatePkb('npg', function  (err,res) {

	if(err){
		console.log(err);
	}

	console.log(res);
	// body...
});