'use strict';



var CSV     = require('csv-string');
var request = require('request');
var PkbRows = require('../../.lib/pkbrows.js');


  var titles = {};


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
    if (csvSource != undefined) {
      
      titles = csvSource[0];
      csvSource.shift();
      var pkb = new PkbRows('oej');
      pkb.setKbartName();
      for (var i in csvSource) {
        var kbartRow = pkb.initRow({});
        kbartRow = associetElement(titles, csvSource[i]);
        pkb.addRow(kbartRow);
      }
      pkb.writeKbart(); 
       
    } else {
      console.error('Aucune information retournée');
      return;
    }


  
    console.log('file pkb is created');
  });


function associetElement(titles, value) {
  if (!value && value != undefined) {
    return false;
  }
  var elementproportie = {};
  var url = '';
  var testcounter = 1 ;
  if(value['title_id'] === '') {
    return elementproportie;
  }
  for (var k in value) {
    testcounter ++;
    if (value.length == testcounter) { break; }
    if (value[k] !== null || value[k] !== '') {
      elementproportie[titles[k]] = value[k];
    }
  }
  return elementproportie;
}