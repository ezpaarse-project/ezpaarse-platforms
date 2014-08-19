#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for wiley platform
 * http://analogist.couperin.org/platforms/wiley/
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  //console.log(path);

  var match;

  if ((match = /\/journal\/([0-9]{2}\.[0-9]{4})\/\(ISSN\)([0-9]{4}-[0-9]{3}[0-9xX])/.exec(path)) !== null) {
    // /journal/10.1111/%28ISSN%291600-5724
    //result.doi = match[1] + "/" + "(ISSN)" + match[2];
    result.doi = match[1] + "/" + "(ISSN)" + match[2];
    result.online_identifier = match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/([^.]+)\.([0-9]{4}\.[^.]+\.[^.]+)\/issuetoc$/.exec(path)) !== null) {
    // /doi/10.1111/aar.2012.83.issue-1/issuetoc
    // title_id is upper case in PKB from wiley site
    result.doi = match[1] + "/" + match[2] + '.' + match[3];
    result.title_id = match[2].toUpperCase();
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/j\.([0-9]{4}-[0-9]{3}[0-9xX])\.([0-9]{4}\.[^.]+\.[^.]+)\/abstract$/.exec(path)) !== null) {
    // /doi/10.1111/j.1600-0390.2012.00514.x/abstract
    // result.doi = match[1] + "/" + "(ISSN)" + match[2];
    result.doi = match[1] + "/j." + match[2] + '.' + match[3];
    result.online_identifier = match[2];
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/([^.]+)\.([0-9]+)\/abstract$/.exec(path)) !== null) {
    // /doi/10.1002/anie.201209878/abstract
    result.doi = match[1] + "/" + match[2] + '.' + match[3];
    result.title_id = match[2].toUpperCase();
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/([^.]+)\.([0-9]+)\/full$/.exec(path)) !== null) {
    // /doi/10.1111/acv.12024/full
    result.doi = match[1] + "/" + match[2] + '.' + match[3];
    result.title_id = match[2].toUpperCase();
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/j\.([0-9]{4}-[0-9]{3}[0-9xX])\.([0-9]{4}\.[^.]+\.[^.]+)\/pdf$/.exec(path)) !== null) {
    // /doi/10.1111/j.1600-0390.2012.00514.x/pdf
    // result.doi = match[1] + "/" + "(ISSN)" + match[2];
    result.doi = match[1] + "/j." + match[2] + '.' + match[3];
    result.online_identifier = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/([^.]+)\.([0-9]+)\/pdf$/.exec(path)) !== null) {
    // /doi/10.1002/anie.201209878/pdf
    result.doi = match[1] + "/" + match[2] + '.' + match[3];
    result.title_id = match[2].toUpperCase();
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/book\/([0-9]{2}\.[0-9]{4})\/([0-9]+)$/.exec(path)) !== null) {
    // /book/10.1002/9781118268117
    result.doi = match[1] + "/" + match[2];
    // ##RN
    result.title_id = match[2].toUpperCase();
    result.rtype = 'BOOK_SECTION';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/([0-9]{2}\.[0-9]{4})\/([0-9]+)\.([^.]+)\/pdf$/.exec(path)) !== null) {
    // /doi/10.1002/9781118268117.ch3/pdf
    // result.doi = match[1];
    result.doi = match[1] + "/" + match[2] + '.' + match[3];
    result.title_id = match[2].toUpperCase();
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
  } else if ((match = /^\/enhanced\/doi\/(([0-9]{2}\.[0-9]{4})\/([^\.]+)\.([^\/]+))\/$/.exec(path)) !== null) {
    // http://onlinelibrary.wiley.com.biblioplanets.gate.inist.fr/enhanced/doi/10.1002/cjg2.20083/
    result.title_id = match[3].toUpperCase();
    result.doi = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/enhanced\/doi\/(([0-9]{2}\.[0-9]{4})\/(([0-9]{4})([a-zA-Z0-9]{2}))([^\/]+))\/$/.exec(path)) !== null) {
    // http://onlinelibrary.wiley.com.biblioplanets.gate.inist.fr/enhanced/doi/10.1002/2013WR014994/
    result.title_id = match[5].toUpperCase();
    result.doi = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/agu\/issue\/(([0-9]{2}\.[0-9]{4})\/([^\.]+)\.([^\/]+))\/$/.exec(path)) !== null) {
    // http://agupubs.onlinelibrary.wiley.com.biblioplanets.gate.inist.fr/agu/issue/10.1002/jgrd.v119.14/
    result.title_id = match[3].toUpperCase();
    result.doi = match[1];
    result.rtype = 'TOC';
    result.mime = 'HTML';
  } else if ((match = /^\/readcube$/.exec(path)) !== null) {
    // http://onlinelibrary.wiley.com:80/readcube?callback=jQuery21009089781963266432_1408430129173&resource=10.1002%2F2014GC005230&_=1408430129174
    if (param.resource !== undefined) {
      result.doi = param.resource;
      if ((match = /([0-9]{2}\.[0-9]{4})\/([0-9]{4})([a-zA-Z0-9]{2})([^\/]+)$/.exec(param.resource)) !== null) {
        result.title_id = match[3].toUpperCase();
      }
    }
    result.rtype = 'READCUBE';
    result.mime = 'MISC';
  }
  return result;
});
