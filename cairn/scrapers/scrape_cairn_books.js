#!/usr/bin/env node

// Write a kbart file for the CAIRN book PKB
// Write on stderr the progression
// Usage : ./scrape_cairn_books.js

/*jslint maxlen: 180*/

'use strict';


var request     = require('request').defaults({
  jar: true,
  proxy: process.env.HTTP_PROXY ||
         process.env.HTTPS_PROXY ||
         process.env.http_proxy
});

var cheerio = require('cheerio');
var url = 'http://www.cairn.info/ouvrages-collectifs.php?TITRE=ALL';

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('cairn');

// setKbartName() is required to fix the kbart output file name
//   pkb.consortiumName = '';       // default empty
pkb.packageName = 'books'; // default AllTitles
pkb.setKbartName();


//console.log("title;pid;url");
request(url, function (err, resp, body) {
  if (err) { throw err; }
  var $ = cheerio.load(body);
  $('div.review.borderTop > ul > li > a').each(function () {
    var info = {};

    // initialize a kbart record
    info = pkb.initRow(info);

    info.title_url = $(this).attr('href');
    info.publication_title = $(this).attr('title');
    info.title_id = $(this).find('img').attr('src').match(/\.\/vign_rev\/(.*?)\/(.*?)_H138.jpg/)[2];
    pkb.addRow(info);
  });
});
