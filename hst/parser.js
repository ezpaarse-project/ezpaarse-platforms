#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Henry Stewart Talks
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

  if ((match = /^\/upload\/content\/[a-z]+\/[a-z]+\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://hstalks.com/upload/content/talk/handouts/4692.pdf
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    result.unitid = match[1];


  } else if ((match = /^\/t\/([0-9]+)\/[a-z-]+\/$/i.exec(path)) !== null) {
    // https://hstalks.com/t/4692/medical-decision-making-in-acute-care-philosophy-a/?biosci
    // https://hstalks.com/t/4428/logistics-managing-geography/?business
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.db_id = Object.getOwnPropertyNames(param)[0];
  } else if (/^\/search\/[a-z]+\/$/i.test(path)) {
    // https://hstalks.com/search/agriculture/?biosci&subtype=TALK&filters=category_id%7C780
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
