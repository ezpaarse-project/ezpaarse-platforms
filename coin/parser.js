#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Company.Info
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

  if ((match = /^\/resources\/files\/[a-z]+\/[0-9]+\/[0-9]+\/[0-9]+\/([a-z0-9_]+)\.pdf$/i.exec(path)) !== null) {
    // https://company.info/resources/files/reports/30/18/50/GYROENERGY_Vennootschappelijk_2016.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/([a-z]+)\/search$/i.exec(path)) !== null) {
    // https://company.info/organisations/search?query=gyro
    // https://company.info/news/search?sectors=ledenorganisaties&query=Suzuki
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = param.sectors;
  } else if ((match = /^\/id\/([0-9]+)$/i.exec(path)) !== null) {
    // https://company.info/id/301850080000
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
