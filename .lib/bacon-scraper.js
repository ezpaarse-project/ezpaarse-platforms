'use strict';

var fs = require('fs');

var request = require('request').defaults({
			proxy: process.env.http_proxy ||
			process.env.HTTP_PROXY ||
			process.env.https_proxy ||
			process.env.HTTPS_PROXY
			});


/*

	var url = "https://bacon.abes.fr/list.json";
	request.get(url,function(err,res,body){
	
		var list;
		if(err){
			callback(new Error(err));
		}
		try {
		var result = JSON.parse(body);
		list = result.bacon.query.results;
			
		} catch(e) {
	
		callback(new Error(e));
			
		}
		fs.readdir('../', function (err, folder) {
		var i =0;
		var testexist =0;
		var j = 4;
	
    	while (i< list.length ) {
    	
    		j = 4;
    		while (j<folder.length){

	    		var re = /.json/ig;
				if(re.exec(folder[j]) == null){
		    		var data = require('../' + folder[j] + '/manifest.json');
		    			if( data.baconprovider) console.log(data.baconprovider );
		    		if (list[i].element.provider===data.baconprovider) {
		    			
		    			console.log("Pkb déjà enregistrer : " + list[i].element.provider);
		    			testexist = 1;
		    			break;
		    		}
		    		
		    	} 
	    	j++;
    		}
    		if (testexist === 0) {
    			console.log("Platforme disponible chez bacon : " + list[i].element.provider);
    		}
    		testexist =0;
    		i++;
    	}
    		
    	});
    });

*/
exports.generatePkb = function(namePlatform,callback) {

var PkbRows  = require('./pkbrows.js');
var pkb      = new PkbRows(namePlatform);
var package_id='';
var data = require('../'+namePlatform+'/manifest.json');

pkb.setKbartName();
fs.exists('../pkb', function(exists) {
    if (!exists) {
    	  fs.mkdirSync('../pkb');
    	 console.log("create folder pkb");
    }
});

var url = "https://bacon.abes.fr/list.json";
request.get(url,function(err,res,body){
		var list;
		if(err){
			callback(new Error(err));
		}
		try {
		var result = JSON.parse(body);
		list = result.bacon.query.results;

		} catch(e) {
	
		callback(new Error(e));
			
		}
		var i =0;
		console.log('cherche la platforme dans la liste des platformes bacon');
    	while ( i< list.length) {
    		if (list[i].element.provider===data.baconprovider) {
    			package_id=list[i].element.package_id;

    			break;
    		}
    		i++;
    	}
    	if(package_id != ''){
	    	var urlpkb =  'http://bacon.abes.fr/package2kbart/' + package_id +'.json'; 

			request.get(urlpkb,function(err,res,body){
				
				var list;
				if(err){
					callback(new Error(err));
				}
				var result = JSON.parse(body);
				
				var listpkb =result.bacon.query.kbart;
          		

				var kbartRow = pkb.initRow({});

				var j =0;
			
		    	while( j < listpkb.length) {
					kbartRow.publication_title = listpkb[j].element.publication_title;
					kbartRow.print_identifier = listpkb[j].element.print_identifier;
				
					kbartRow.title_url = listpkb[j].element.title_url;
					if (kbartRow.title_id == null) { kbartRow.title_id = '-'; }
					else { kbartRow.title_id = listpkb[j].element.title_id;}
					kbartRow.coverage_depth = listpkb[j].element.coverage_depth;
					kbartRow.publisher_name  = listpkb[j].element.publisher_name;
					kbartRow.publication_type = listpkb[j].element.publication_type;
					kbartRow.access_type = listpkb[j].element.access_type;
			
					pkb.addRow(kbartRow);
					pkb.writeKbart();
					j++
          		}
   
          		console.log("file pkb is created");
          		callback(null,'traitement end');
	    	});
			
		} else {
			 callback(new Error('unexpected result, platform not found'));
		}

	});
}


exports.checkNewPkb = function() {
}

	