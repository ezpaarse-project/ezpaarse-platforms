
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
	var data = require('../' + namePlatform + '/manifest.json');
	//test si le dossier de la platforme contient un fichier pkb sinon il le crée
	var pkbfolder = path.join(__dirname, '../pkb');
	var countFileCreate = 0; 
	fs.mkdir(pkbfolder, function(err){
		if (err &&  err.code != 'EEXIST') {
			return callback(err);
		}
		console.log("create folder pkb");
		var url = "https://bacon.abes.fr/list.json";
		request.get(url, function(err, res, body) {
			var list;
			if (err) {
				return callback(err);
			}
			try {
				list = JSON.parse(body).bacon.query.results;
			} catch (e) {
				return callback(e);
			}
			
			console.log('cherche la platforme dans la liste des platformes bacon');
			var i = -1;
			(function checklist(){	
				i++;
				if (!list[i]){
					return callback(null, countFileCreate );
				}
				var package_id = '';
				if (list[i].element.provider != data.baconprovider) {
					return checklist();
				}	
				
				package_id = list[i].element.package_id;
				var pkb = new PkbRows(namePlatform);
				var urlpkb = 'http://bacon.abes.fr/package2kbart/' + package_id + '.json';
				request.get(urlpkb, function(err, res, body) {
					pkb.setKbartName(package_id);
					if (err) {
						return callback(err);
					}
					
					var listpkb = JSON.parse(body).bacon.query.kbart;
					var j = 0;
					while (j < listpkb.length) {
						var kbartRow = pkb.initRow({});
						kbartRow = getElement(listpkb[j].element) ;
						pkb.addRow(kbartRow);
						j++;
					}
					pkb.writeKbart();
					countFileCreate++;
					console.log("file pkb is created");
					return checklist();
				});
					
			})(); 
		
		});
	});
	
	
	//récupération de la liste des platforme sur le site de abes
	
};

function getElement(elementBacon){
	var element = {};
	for(var k in elementBacon ){
		if (elementBacon[k] != null){
			element[k] = elementBacon[k];
		}
	}
	return element;
}

exports.checkNewPkb = function() {
	var re;
	var data;
	var url = "https://bacon.abes.fr/list.json";
	request.get(url, function(err, res, body) {
		var list;
		if (err) {
			return console.error(err);
		}
		try {
			var result = JSON.parse(body);
			list = result.bacon.query.results;
		} catch (e) {
			return console.error(e);
		}
		var p = path.join(__dirname , '/../' );
		
		fs.readdir(p , function(err, folder) {
			var i = 0;
			var j = 4;
			if (!list) {
				return console.error("Bacon not connected");
			}
			while (i < list.length) {
				j = 4;
				if(!folder) {
					return console.error('empty folder');
				}
				while (j < folder.length) {
					re = /(.json|.md)/ig;
					if (re.exec(folder[j]) == null) {
						data = require('../' + folder[j] + '/manifest.json');
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
					re = /(.json|.md)/ig;
					if (re.exec(folder[j]) == null) {
						data = require('../' + folder[j] + '/manifest.json');
						if (list[i].element.provider != data.baconprovider) {
							console.log(" " + list[i].element.provider + " à télécharger");
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