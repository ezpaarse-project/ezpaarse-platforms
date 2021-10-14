#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Investor State Law Guide
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

  if ((match = /^\/Documents\/PDFFiles\/([a-z0-9-]+)%(.+?)\.pdf$/i.exec(path)) !== null) {
    // https://app.investorstatelawguide.com/Documents/PDFFiles/IC-0248-05%20-%20Axos%20Capital%20v.%20Kosovo%20-%20Award%20-%20C%20-%20TD.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/view-dispute-document\/([a-z0-9-]+)\/(.+?)$/i.exec(path)) !== null) {
    // https://app.investorstatelawguide.com/view-dispute-document/IC-0248-05/ACP%20Axos%20Capital%20GmbH%20v.%20Republic%20of%20Kosovo/%20JiYEHGIRfw=
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/browse-profiles\/people-profile\/(.+?)$/i.exec(path)) !== null) {
    // https://app.investorstatelawguide.com/browse-profiles/people-profile/Jerome%20Temme/spoZz5ozHQQ=
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
  } else if ((match = /^\/view-dispute-detail\/(.+?)\/(.+?)$/i.exec(path)) !== null) {
    // https://app.investorstatelawguide.com/view-dispute-detail/ACP%20Axos%20Capital%20GmbH%20v.%20Republic%20of%20Kosovo/w2Ujy178P2o=
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
  }

  return result;
});
