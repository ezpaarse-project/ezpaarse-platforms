#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Reference USA
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

  if ((match = /^\/[a-zA-Z]+\/Result\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // http://www.referenceusa.com/UsHistoricalBusiness/Result/76922f4853834bf59bb7fdf5afb8e4ad
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/[a-zA-Z]+\/Detail\/Tagged\/[a-zA-Z0-9]+\/[0-9]+$/i.exec(path)) !== null) {
    // http://www.referenceusa.com/UsHistoricalBusiness/Detail/Tagged/76922f4853834bf59bb7fdf5afb8e4ad/2011?recordId=246360150
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = param.recordId;
    result.unitid   = param.recordId;
  } else if ((match = /^\/[a-zA-Z]+\/[a-zA-Z]+\/.+\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.referenceusa.com/UsBusiness/CorpFamilyTree/%20c291a5e19ef44bb29a1fe056e9f11fb6/886012012
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }
  result.platform_name ='reference usa';
  return result;
});
