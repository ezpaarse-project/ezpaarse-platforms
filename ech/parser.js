#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Les Echos
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/liseuse\/LEC$/i.test(path)) {
    // /liseuse/LEC?date=20220425
    result.rtype = 'ISSUE';
    result.mime = 'HTML';
    result.unitid = param.date;
    result.publication_date = param.date;

  } else if (/^\/recherche$/i.test(path)) {
    // /recherche?q=covid
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/[a-z-]+([0-9]+)$/i.exec(path)) !== null) {
    // /monde/enjeux-internationaux/ukraine-malgre-les-pressions-occidentales-linde-se-refuse-a-critiquer-la-russie-1396246
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
