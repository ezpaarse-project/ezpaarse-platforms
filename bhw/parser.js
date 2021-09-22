#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Brockhaus Wissenservice
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

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/ecs\/karta\/tematisk\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /ecs/karta/tematisk/wolfgang-amadeus-mozart-reisewege
    result.rtype = 'MAP';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/ecs\/bild\/fotografi\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /ecs/bild/fotografi/olympische-flamme-zeremonie-olympia
    result.rtype = 'IMAGE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/ecs\/enzy\/article\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /ecs/enzy/article/fraunhofer-joseph
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
