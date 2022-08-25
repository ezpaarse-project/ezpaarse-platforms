#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Film Indexes Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/fiaf\/([a-z]+)\/(([a-z]+)_([a-z]+)\.htm)$/.exec(path)) !== null) {
    // http://film.chadwyck.co.uk/fiaf/framesets/fii_frameset.htm
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[2];

  } else if ((match = /^\/fulltext\/(([a-z]+).do)$/.exec(path)) !== null) {
    // http://fiaf.chadwyck.com/fulltext/showpdf.do?PQID=3628645371&jid=006/0000279&id=004/
    //0434099&year=2015&area=index
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.id;
    result.unitid   = param.id;
    result.publication_date = param.year ;
  }

  return result;
});

