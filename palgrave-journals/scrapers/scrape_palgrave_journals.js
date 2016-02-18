#!/usr/bin/env node

// Write a kbart file with the ACS journals PKB
// Write on stderr the progression
// Usage : ./scrape_acs_journals.js

/*jslint maxlen: 180*/

'use strict';

var request = require('request').defaults({
  proxy:  process.env.HTTP_PROXY ||
          process.env.http_proxy ||
          process.env.HTTPS_PROXY ||
          process.env.https_proxy
});
var cheerio = require('cheerio');

var PkbRows = require('../../.lib/pkbrows.js');
var pkb     = new PkbRows('palgrave-journals');
pkb.setKbartName();

// A-Z index of palgrave journals
var journalsUrl = 'http://www.palgrave-journals.com/pal/jnlindex.html';

request.get(journalsUrl, function (err, res, body) {
  if (err) {
    console.error('[Error] Could not get the index page');
    process.exit(1);
  }

  var $     = cheerio.load(body);
  var links = $('#content .links a').filter(function () {
    var href = $(this).attr('href');
    return (/^\/[a-z]+\/?$/.test(href) || /^http:\/\/www\.palgrave-journals\.com\/([a-z]+)\/?$/.test(href));
  });

  var i = 0;
  (function browseNext(callback) {
    var link = links.get(i++);
    if (!link) { return callback(); }
    var href = $(link).attr('href');


    var title_id;
    var match;

    if ((match = /^\/([a-z]+)\/?$/.exec(href)) !== null) {
      href = 'http://www.palgrave-journals.com' + href;
      title_id = match[1];
    } else if ((match = /^http:\/\/www\.palgrave-journals\.com\/([a-z]+)\/?$/.exec(href)) !== null) {
      title_id = match[1];
    } else {
      return browseNext(callback);
    }

    console.error('(%d/%d) %s', i, links.length, href);

    var kbartRow = pkb.initRow({});
    kbartRow.title_id  = title_id;
    kbartRow.title_url = href;

    request.get(href, function (err, response, content) {
      if (err) {
        console.error('[Error] Could not get %s', href);
        pkb.addRow(kbartRow);
        return browseNext(callback);
      }

      var $$      = cheerio.load(content);
      var details = $$('#content .journal-details');

      if (details.length === 0) {
        details = $$('p.issn, p.eissn');
      }
      if (details.length === 0) {
        details = $$('abbr[title="International Standard Serial Number"], Electronic International Standard Serial Number').parent();
      }

      if (details.length > 0) {
        var text = details.text();
        var reg  = /(E)?ISSN:? *([0-9]{4}-[0-9]{3}[0-9X]) *(?:\(([a-z]+)\))?/gi;

        while ((match = reg.exec(text)) !== null) {
          if (match[1] || match[3] == 'online') {
            kbartRow.online_identifier = match[2];
          } else {
            kbartRow.print_identifier = match[2];
          }
        }
      }

      kbartRow.publication_title = $$('#content .welcome .journalname').first().text();

      pkb.addRow(kbartRow);

      setTimeout(function() {
        browseNext(callback);
      }, 1000);
    });
  })(function done() {
    pkb.writeKbart();
    console.log('Kbart generated in %s', pkb.kbartFileName);
  });
});
