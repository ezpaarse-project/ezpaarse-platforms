#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Film Indexes Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/fiaf\/([a-z]+)\/(([a-z]+)\_([a-z]+)\.htm)$/.exec(path)) !== null) {
    // http://film.chadwyck.co.uk/fiaf/framesets/fii_frameset.htm
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[2];
  } else if ((match = /^\/fulltext\/(([a-z]+).do)$/.exec(path)) !== null) {
    // http://fiaf.chadwyck.com/fulltext/showpdf.do?PQID=3628645371&jid=006/0000279&id=004/
    //0434099&year=2015&area=index
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.id;
    result.publication_date =  param.year ;
    result.unitid   = param.id;
  }

  return result;
});

