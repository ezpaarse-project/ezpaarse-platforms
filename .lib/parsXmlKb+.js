
'use strict';
var CSV   = require('csv-string');
var request = require('request').defaults({
proxy: process.env.http_proxy ||
process.env.HTTP_PROXY ||
process.env.https_proxy ||
process.env.HTTPS_PROXY
});

exports.generatePkbKbp = function(nbrPkbKbp, platformName, positionTitle){
	var titles = {};
	var PkbRows = require('./pkbrows.js');
	var url = 'http://www.kbplus.ac.uk/kbplus/publicExport/pkg/' ;
	url += nbrPkbKbp + '?format=xml&transformId=kbart2';
	request.get(url, function(err, res, body) {
		var pkb = new PkbRows(platformName);
		pkb.setKbartName();
		var csvSource = CSV.parse(body, CSV.detect(body));
		titles = csvSource[0];	  
		for(var i in csvSource){
			var kbartRow = pkb.initRow({});
			kbartRow = associetElement(titles,csvSource[i], positionTitle);
			pkb.addRow(kbartRow);
		}
		pkb.writeKbart();
		console.log("file pkb is created");
	});
};

function associetElement(titles , value, positionTitle){
	var elementproportie = {};
	var url = "";
	var testcounter = 1 ;
	for(var k in value ){
		testcounter ++;
		if(value.length == testcounter  ){
			break;
		}
		if(titles[k] === "title_url"){
			url = value[k];
		}
		if (value[k] !== null || value[k] !== '' ){
			elementproportie[titles[k]] = value[k];
		}
		
	}
	var title = url.split('/')[positionTitle];
	var title_id = 'title_id';
	elementproportie[title_id] = title;
	
	return elementproportie;
}