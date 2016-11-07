/* eslint global-require: 0 */
'use strict';
var fs      = require('fs');
var path    = require('path');
var request = require('request');
var PkbRows = require('./pkbrows.js');

exports.generatePkb = function (platformName, callback) {
  var data = require('../' + platformName + '/manifest.json');
  var pkbfolder = path.join(__dirname, '../pkb');
  var nbFileCreated = 0;

  fs.mkdir(pkbfolder, function(err) {
    if (err &&  err.code != 'EEXIST') { return callback(err); }

    console.log('Check pkb folder ', pkbfolder);
    var url = 'https://bacon.abes.fr/list.json';
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

      console.log('Search %s platform in bacon platform list', data.baconprovider);
      var i = -1;
      (function checklist() {
        i++;
        if (!list[i]) {
          return callback(null, nbFileCreated);
        }
        var package_id = '';
        if (list[i].element.provider != data.baconprovider) {

          return checklist();
        }
        if (data.type) {
          let reg = / /;
          reg.compile(data.type);
          if (!reg.test(list[i].element.package_id)) {
            return checklist();
          }
        }
        package_id = list[i].element.package_id;
        var pkb = new PkbRows(platformName);
        var pkbUrl = 'http://bacon.abes.fr/package2kbart/' + package_id + '.json';
        request.get(pkbUrl, function(err, res, body) {
          pkb.setKbartName(package_id);
          if (err) {
            return callback(err);
          }

          var listpkb;
          try {
            listpkb = JSON.parse(body).bacon.query.kbart;
          } catch (e) {
            console.error(pkbUrl, 'json parse error');
            return checklist();
          }

          var j = 0;
          while (j < listpkb.length) {
            pkb.addRow(listpkb[j].element);
            j++;
          }
          pkb.writeKbart();
          nbFileCreated++;
          console.log('File %s created', pkb.kbartFileName);
          return callback();
        });

      })();

    });
  });


  //récupération de la liste des platforme sur le site de abes

};

exports.checkNewPkb = function() {
  var re;
  var data;
  var url = 'https://bacon.abes.fr/list.json';
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
    var p = path.join(__dirname, '/../');

    fs.readdir(p, function(err, folder) {
      var i = 0;
      var j = 4;
      if (!list) {
        return console.error('Bacon not connected');
      }
      while (i < list.length) {
        j = 4;
        if (!folder) {
          return console.error('empty folder');
        }
        while (j < folder.length) {
          re = /(.json|.md)/ig;
          if (re.exec(folder[j]) == null) {
            data = require('../' + folder[j] + '/manifest.json');
            if (list[i].element.provider === data.baconprovider) {
              console.log(' ' + list[i].element.provider + ' ==> OK');
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
              console.log(' ' + list[i].element.provider + ' à télécharger');
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
