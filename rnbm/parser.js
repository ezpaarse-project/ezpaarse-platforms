#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Licence RNBM
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/trouver\/?$/i.exec(path)) !== null) {
    // /trouver?search_api_fulltext=jstor
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  } else if ((match = /^\/licence\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // /licence/aims-revues
    result.rtype  = 'RECORD';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/sites\/default\/files\/licences\/publics\/([a-z0-9_-]+(\.[a-z]+)?)$/i.exec(path)) !== null) {
    // /sites/default/files/licences/publics/JSTORMathStatdec2020_0.ods
    result.rtype  = 'METADATA';
    result.unitid = match[1];
    result.mime   = 'MISC';

    if (/^\.(ods|xls)x?$/i.test(match[2])) {
      result.mime = 'XLS';
    } else if (/^\.(odt|doc)x?$/i.test(match[2])) {
      result.mime = 'DOC';
    } else if (/^\.pdf$/i.test(match[2])) {
      result.mime = 'PDF';
    }
  } else if ((match = /^(?:\/index.php)?\/news\/(([0-9]{4})([0-9]{2})([0-9]{2}))\/?$/i.exec(path)) !== null) {
    // /news/20240312
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.publication_date = `${match[2]}-${match[3]}-${match[4]}`;
  } else if ((match = /^\/mot-cle\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // /mot-cle/ams
    result.rtype  = 'SEARCH_FACET';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
