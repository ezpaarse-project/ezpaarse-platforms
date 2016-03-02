'use strict';

var CSV     = require('csv-string');
var request = require('request');
var PkbRows = require('./pkbrows.js');

exports.generatePkbKbp = function (nbrPkbKbp, platformName) {
  var titles = {};
  var opt = {
    url: `http://www.kbplus.ac.uk/kbplus/publicExport/pkg/${nbrPkbKbp}`,
    qs: { format: 'xml', transformId: 'kbart2' }
  };

  request.get(opt, function (err, res, body) {
    var pkb = new PkbRows(platformName);
    pkb.setKbartName();
    var csvSource = CSV.parse(body, CSV.detect(body));
    titles = csvSource[0];
    csvSource.shift();

    for (var i in csvSource) {
      var kbartRow = pkb.initRow({});
      kbartRow = associetElement(titles, csvSource[i]);
      pkb.addRow(kbartRow);
    }

    pkb.writeKbart();
    console.log('file pkb is created');
  });
};

function associetElement(titles, value) {
  var elementproportie = {};
  var url = '';
  var testcounter = 1 ;
  for (var k in value) {
    testcounter ++;
    if (value.length == testcounter) { break; }
    if (titles[k] === 'title_url') { url = value[k]; }
    if (value[k] !== null || value[k] !== '') {
      elementproportie[titles[k]] = value[k];
    }
  }
  var spliturl = url.split('/');
  var valtitleid = spliturl[spliturl.length - 1];
  var title_id = 'title_id';
  elementproportie[title_id] = valtitleid.split('.')[0];

  return elementproportie;
}