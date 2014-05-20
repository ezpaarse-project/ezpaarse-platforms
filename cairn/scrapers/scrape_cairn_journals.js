/*
Usage : node scrape_cairn_journals.js > cairn.pkb.journals.YYYYMMDD.csv
*/


/*jslint maxlen: 180*/

'use strict';


var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.cairn.info/Accueil_Revues.php?TITRE=ALL';

console.log("title;pid;url");
request(url, function (err, resp, body) {
  if (err) { throw err; }
  var $ = cheerio.load(body);
  $('div.review.borderTop > ul > li > a').each(function () {
    var url = $(this).attr('href');
    var title = $(this).attr('title');
    var pid = $(this).find("img").attr("src").match(/\.\/vign_rev\/(.*?)\/.*?jpg/)[1];
    console.log(title + ";" + pid + ";" + "http://www.cairn.info/" + url);
  });
});
