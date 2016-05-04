'use strict';

var CSV     = require('csv-string');
var request = require('request');
var PkbRows = require('../../.lib/pkbrows.js');
var url     = require('url');

var csvHeaders = {};


var opt = {
  url: 'http://www.openedition.org/index.html',
  qs: { page: 'coverage', pubtype: 'revue', export: 'tsv', kbart: '1' }
};

request.get(opt, function (err, res, body) {
  if (err) {
    console.error(err);
    return;
  }

  var csvSource = CSV.parse(body, CSV.detect(body));
  if (csvSource !== undefined) {
    csvHeaders = csvSource[0];
    csvSource.shift();
    var pkb = new PkbRows('oej');
    pkb.setKbartName();
    for (var i in csvSource) {
      var kbartRow = pkb.initRow({});
      kbartRow = associateElements(csvHeaders, csvSource[i]);
      //add a pkb-piddomain to the kbart row, based on the url
      kbartRow['pkb-piddomain'] = url.parse(kbartRow['title_url']).hostname;
      pkb.addRow(kbartRow);
    }
    pkb.writeKbart(); 
  } else {
    console.error('Aucune information retournée');
    return;
  }
  console.log('file pkb is created');
});


function associateElements(titles, values) {
  if (!values && values !== undefined) {
    return false;
  }
  var elementProperties = {};
  var testcounter = 1 ;
  if(values['title_id'] === '') {
    return elementProperties;
  }
  for (var k in values) {
    testcounter ++;
    if (values.length == testcounter) { break; }
    if (values[k] !== null || values[k] !== '') {
      elementProperties[titles[k]] = values[k];
    }
  }
  return elementProperties;
}
