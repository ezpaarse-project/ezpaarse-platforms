#!/usr/bin/env node

// Write on stdout the Persée journals PKB
// Write on stderr the progression
// Usage : ./scrape_persee.js > persee.pkb.csv

/*jslint maxlen: 180*/

'use strict';

var request     = require('request').defaults({
  //proxy: 'http://proxyout.inist.fr:8080'
  //proxy: 'http://cache.univ-st-etienne.fr:3128'
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});
var xml         = require('xml-mapping');
//var fs          = require('fs');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('persee');

var journalsUrl = 'http://oai.persee.fr/c/ext/prescript/oai?verb=ListSets';
request(journalsUrl, function (err, resp, body) {
  if (err) { return console.error(err); }

  var oaiJson = xml.load(body);
  if (!oaiJson ||
      !oaiJson['OAI-PMH'] ||
      !oaiJson['OAI-PMH']['ListSets'] ||
      !oaiJson['OAI-PMH']['ListSets']['set']) {
    return console.error('OAI-PMH format is unknown: OAI-PMH/ListSets/set');
  }
  oaiJson['OAI-PMH']['ListSets']['set'].forEach(function (set) {
    var journalInfo = {};

    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);

    if (set['setSpec']) {
      try {
        journalInfo.title = set['setDescription']['oai_dc$dc']['dc$title']['$t'];
      } catch (err) {
        journalInfo.title = '';
      }

      try {
        journalInfo.pid   = set['setSpec']['$t'].split(':')[2];
      } catch (err) {
        journalInfo.pid   = '';
      }

      try {
        journalInfo.pissn  = '';
      } catch (err) {
        journalInfo.pissn   = '';
      }

      try {
        journalInfo.eissn = set['setDescription']['oai_dc$dc']['dc$identifier'][0]['$t'];
      } catch (err) {
        journalInfo.eissn = '';
      }

      try {
        journalInfo.pidurl  = set['setDescription']['oai_dc$dc']['dc$identifier'][1]['$t'];
      } catch (err) {
        journalInfo.pidurl  = '';
      }
    }

    pkb.addRow(journalInfo);
  });

  pkb.writeCSV(process.stdout);
});

