'use strict';

var fs = require('fs');
var path = require('path');
var request = require('request').defaults({
proxy: process.env.http_proxy ||
process.env.HTTP_PROXY ||
process.env.https_proxy ||
process.env.HTTPS_PROXY
});

exports.generatePkb = function(namePlatform, callback) {

	var PkbRows = require('./pkbrows.js');
	var pkb = new PkbRows(namePlatform);
	var package_id = '';

	var data = require('../' + namePlatform + '/manifest.json');


	fs.exists('../pkb', function(exists) {
		if (!exists) {
			fs.mkdirSync('../pkb');
			console.log("create folder pkb");
		}
	});

	var url = "https://bacon.abes.fr/list.json";
	request.get(url, function(err, res, body) {
		var list;
		if (err) {
			callback(new Error(err));
		}
		try {
			var result = JSON.parse(body);
			list = result.bacon.query.results;

		} catch (e) {

			callback(new Error(e));

		}

		var i = 0;
		console.log('cherche la platforme dans la liste des platformes bacon');
		while (i < list.length) {

			if (list[i].element.provider === data.baconprovider) {
				package_id = list[i].element.package_id;

				break;
			}
			i++;
		}

		if (package_id) {
			pkb.setKbartName(package_id);
			var urlpkb = 'http://bacon.abes.fr/package2kbart/' + package_id + '.json';

			request.get(urlpkb, function(err, res, body) {

				if (err) {
					callback(new Error(err));
				}
				var result = JSON.parse(body);

				var listpkb = result.bacon.query.kbart;

				var j = 0;

				while (j < listpkb.length) {

					if (listpkb[j].element.title_id) {
						var kbartRow = pkb.initRow({});

						kbartRow.publication_title = listpkb[j].element.publication_title;
						kbartRow.print_identifier = listpkb[j].element.print_identifier;
						kbartRow.title_url = listpkb[j].element.title_url;
						kbartRow.title_id = listpkb[j].element.title_id;
						kbartRow.coverage_depth = listpkb[j].element.coverage_depth;
						kbartRow.publisher_name = listpkb[j].element.publisher_name;
						kbartRow.publication_type = listpkb[j].element.publication_type;
						kbartRow.access_type = listpkb[j].element.access_type;

						pkb.addRow(kbartRow);
						pkb.writeKbart();
					}
					j++;
				}

				console.log("file pkb is created");
				callback(null, 'traitement end');
			});

		} else {
			callback(new Error('unexpected result, platform not found'));
		}

	});
};


exports.checkNewPkb = function() {
	
	var re;
	var data;
	var url = "https://bacon.abes.fr/list.json";
	request.get(url, function(err, res, body) {

		var list;
		if (err) {
			console.error(new Error(err));
		}
		try {
			var result = JSON.parse(body);
			list = result.bacon.query.results;

		} catch (e) {

			console.error(new Error(e));

		}
		var p = path.normalize(path.dirname(__filename) + '/../' );
		console.log(p);
		fs.readdir(p , function(err, folder) {
			var i = 0;
			var j = 4;
			if (!list) { 
				console.error("Bacon  not connected");
				return;
			}
			while (i < list.length) {

				j = 4;
				if(!folder) {
					console.error('empty folder');
					return;
				}
				while (j < folder.length) {

					re = /.json/ig;
					if (re.exec(folder[j]) == null) {
					
 						data = require(path.normalize(path.dirname(__filename) + 
 						 '/../' + folder[j] + '/manifest.json'));
						if (list[i].element.provider === data.baconprovider) {

							console.log(" " + list[i].element.provider + " ==> OK" );

							break;
						}
					}
					j++;
				}
				i++;
			}
			i = 0;
			while (i < list.length) {
				j = 4;
				while (j < folder.length) {

					re = /.json/ig;
					if (re.exec(folder[j]) == null) {
						 data = require('../' + folder[j] + '/manifest.json');

						if (list[i].element.provider != data.baconprovider) {

							console.log(" " + list[i].element.provider + " à télécharger" , 'color: green; font-weight: bold;');

							break;
						}
					}
					j++;
				}
				i++;
			}
		
		});
	});
};