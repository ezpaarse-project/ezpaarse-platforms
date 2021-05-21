#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform JAMA Network
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

  if ((match = /^\/journals\/jama\/fullarticle\/([0-9]+)$/i.exec(path)) !== null) {
    // https://jamanetwork.com/journals/jama/fullarticle/2779993
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/searchresults$/i.exec(path)) !== null) {
    // https://jamanetwork.com/searchresults?q=COVID&allSites=1&SearchSourceType=1&exPrm_qqq={!payloadDisMaxQParser%20pf=Tags%20qf=Tags^0.0000001%20payloadFields=Tags%20bf=}%22COVID%22&exPrm_hl.q=COVID
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
