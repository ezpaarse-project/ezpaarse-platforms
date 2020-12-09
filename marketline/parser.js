#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MarketLine Advantage
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

  if ((match = /^\/Analysis\/ViewasPDF\/(.+)[-]([0-9]{3,7})/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://advantage.marketline.com:443/Analysis/ViewasPDF/smart-hospitals-covid-19-is-encouraging-an-already-rapidly-growing-trend-108385

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/Analysis\/ExportFullReportToPdf\/(.+)[-]([0-9]{3,7})/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    // https://advantage.marketline.com:443/Analysis/ExportFullReportToPdf/russia-approves-covid-19-vaccine-eager-to-lead-the-vaccine-race-whatever-the-cost-105571?viewertype=embed
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/Company\/(Summary|ResearchReports)\/(.+)$/i.exec(path)) !== null) {
    // https://advantage.marketline.com:443/Company/Summary/microsoft_corporation
    // https://advantage.marketline.com:443/Company/ResearchReports/microsoft_corporation
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/(News)\/(.+)$/i.exec(path)) !== null) {
  // https://advantage.marketline.com:443/News/firmenich-announces-the-world-s-first-ai-created-flavor-8162306
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }
  return result;

});
