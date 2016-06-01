#!/usr/bin/env node

'use strict';


var request = require('request').defaults({ jar: true });
var cheerio = require('cheerio');
var CSV     = require('csv-string');
var PkbRows = require('../../.lib/pkbrows.js');

var url = 'http://ieeexplore.ieee.org/Xplorehelp/partials/administrators-and-librarians/title-lists.html';
request(url, function (err, resp, body) {
  var $ = cheerio.load(body);
  $('.resources-table a').each(function () {
    var testurl = $(this).attr('href');
    var match ;
    if ((match = /http\:\/\/ieeexplore\.ieee\.org\/otherfiles\/IEEEXplore\_Global\_All\-([\w\W]+).txt/.exec(testurl)) !== null) {
      var titre = {};
      titre.titre = match[1];
      titre.url = testurl;
      createPKB(titre, function(err) {
        if (err) {
          console.log(err);
        }
        console.log('create pkb');
      });
    }

  });

});

function createPKB (titre, callback) {
  request(titre.url, function (err, resp, body) {
    if (err) {
      return callback(err);
    }
    var csvSource = CSV.parse(body, CSV.detect(body));
    if (csvSource != undefined) {
      var pkb = new PkbRows('ieee');
      pkb.setKbartName(titre.titre);
      var titles = csvSource[0];
      csvSource.shift();
      for (var i in csvSource) {
        var kbartRow = pkb.initRow({});
        kbartRow = associetElement(titles, csvSource[i]);
        pkb.addRow(kbartRow);
      }
      if (!pkb.writeKbart()) {
        return;
      }
    } else {
      console.error('Aucune information retournée');
      return;
    }

  });
}


function associetElement(titles, value) {
  if (!value && value != undefined) {
    return false;
  }
  var elementproportie = {};

  var testcounter = 1 ;
  for (var k in value) {
    testcounter ++;
    if (value.length == testcounter) { break; }
    if (value[k] !== null || value[k] !== '') {
      elementproportie[titles[k]] = value[k];
    }
  }



  return elementproportie;
}