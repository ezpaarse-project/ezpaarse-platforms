#!/usr/bin/env node

// Get the KBART file on IOPScience website
// and rename it to the KBART standard
// Usage : ./scrape_iopscience_journals.js

// On O4/23/2014, the KBART file had the following url:
// 'http://cms.iopscience.org/c8251ead-00f5-11e3-b399-116b8c294dca/IOPscience-AllTitles-2013-08-09.txt?guest=true';'

/*jslint maxlen: 180*/

'use strict';
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

//work locally because the iop website needs more than 2 minutes to send the page...
//var htmlString = fs.readFileSync('localiop.html').toString();
//var $ = cheerio.load(htmlString);
//var kbartUrl =  $('p:contains("Download KBART report") > a').attr('href');
//downloadKBARTFile(kbartUrl);

// entry point: the 'Linking information' page where we scrape the last KBART file adress
var infoPage = 'http://iopscience.iop.org/page/Linking';

function downloadKBARTFile(url){
  var pkbfile = fs.createWriteStream("../../platforms-kb/iopscience/iopscience_2014-04-22.txt");
  http.get(url, function(response) {
    response.pipe(pkbfile);
  });
}

request(infoPage, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var kbartUrl =  $('p:contains("Download KBART report") > a').attr('href');
    //console.log("found kbart url : " + kbartUrl);
    downloadKBARTFile(kbartUrl);
  } else {
    console.log("Unable to request " + infoPage + " : " + error);
  }
});



