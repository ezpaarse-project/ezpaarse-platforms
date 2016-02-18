#!/usr/bin/env node
// Write a kbart file for OHB journals

/*jslint maxlen: 180*/

'use strict';


var XLSX = require('xlsx');

var PkbRows = require('../../.lib/pkbrows.js');
var europresseFileCollections = __dirname + '/../pkb/sources_europresse_pour_bibliotheque_d_enseignement.xlsx';

var xlsx = XLSX.readFile(europresseFileCollections);
var json;

for (var i = 0, j = xlsx.SheetNames.length; i < j; i++) {
  var sheet = xlsx.Sheets[xlsx.SheetNames[i]];

  json = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  if (json.length > 0) { break; }
}

if (json.length === 0) {
  console.error('No data found in the Excel file');
  process.exit(1);
}

var pkb       = new PkbRows('europresse');
pkb.setKbartName();

for (var l = 0; l < json.length; l++) {
  var kbartRow = pkb.initRow({});

  if (json[l]['A']) { kbartRow.publication_title = json[l]['A']; }
  if (json[l]['B']) { kbartRow.print_identifier = json[l]['B']; }
  if (json[l]['C']) { kbartRow.title_id = json[l]['C']; }

  pkb.addRow(kbartRow);
}

pkb.writeKbart();
