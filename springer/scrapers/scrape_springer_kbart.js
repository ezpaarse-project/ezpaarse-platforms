#!/usr/bin/env node

// Get the KBART file on IOPScience website
// and rename it to the KBART standard
// Usage : ./scrape_iopscience_journals.js

// On O4/23/2014, the KBART file had the following url:
// 'http://cms.iopscience.org/c8251ead-00f5-11e3-b399-116b8c294dca/IOPscience-AllTitles-2013-08-09.txt?guest=true';'

/*jslint maxlen: 180*/

'use strict';
var http = require('http');
// var request = require('request');
// var cheerio = require('cheerio');
var fs = require('fs');

var kbartURL = 'http://link.springer.com/lists/complete_packages/';

function downloadKBARTFile(file) {
  console.log("will download : " + kbartURL + file + "...");
  var pkbfile = fs.createWriteStream("../pkb/"+ file);
  http.get(kbartURL + file, function(response) {
    response.pipe(pkbfile);
  });
}

//we only take the complete kbart files (at least for a start)
var Complete_eBooks = 'Springer_Global_Complete_eBooks_2014-07-01.txt';
var Complete_Journals = 'Springer_Global_Complete_Journals_2014-07-01.txt';
var Complete_Reference_Works = 'Springer_Global_Complete_Reference_Works_2014-07-01.txt';
var Complete_Protocols = 'Springer_Global_Complete_Protocols_2014-07-01.txt';

var kbartFiles = [Complete_eBooks, Complete_Journals, Complete_Reference_Works, Complete_Protocols];

kbartFiles.forEach(downloadKBARTFile);

