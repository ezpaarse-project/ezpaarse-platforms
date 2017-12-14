#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Embase
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/journals$/i.test(path)) {
    // https://www.embase.com:443/journals?subaction=issues&issn=15216918&title=Bailliere%27s+Best+Practice+and+Research+in+Clinical+Gastroenterology&volume=29&year=2015&id=1338&id=1338
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.vol      = param.volume;
    result.print_identifier = param.issn;
    result.publication_date = param.year;
    result.title_id = param.title;
    if (Array.isArray(param.id)) {
      result.unitid   = param.id[1];
    } else {
      result.unitid   = param.id;
    }
  } else if (/^\/rest\/searchresults\/executeSearch$/i.test(path)) {
    // https://www.embase.com:443/rest/searchresults/executeSearch
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/rest\/tools\/(.*)$/i.exec(path)) !== null) {
    // https://www.embase.com:443/rest/tools/clipboard?from=clipboard&size=500&offset=0
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
  } else if (/^\/search\/results$/i.test(path)) {
    // https://www.embase.com:443/search/results?subaction=viewrecord&rid=1&page=1&id=L618698723
    if (param.subaction === 'viewrecord') {
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.unitid   = param.id;
    }
  } else if ((match = /^\/rest\/emtree\/(.*)\/.*$/i.exec(path)) !== null) {
    // https://www.embase.com:443/rest/emtree/48268/children
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
