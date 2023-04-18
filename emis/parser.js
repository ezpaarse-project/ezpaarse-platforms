#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform EMIS
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

  //let match;

  if (/^\/php\/search\/docpdf$/i.test(path)) {
    // https://www.emis.com/php/search/docpdf?doc_id=766831747
    // https://www.emis.com/php/search/docpdf?pc=BR&sv=EMIS&doc_id=719516695
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid   = param.doc_id;

  } else if (/^\/php\/search\/pdf2html$/i.test(path)) {
    // https://www.emis.com/php/search/pdf2html?pc=BR&doc_id=719516695&type=1
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = param.doc_id;
  } else if (/^\/php\/companies\/index$/i.test(path)) {
    // https://www.emis.com/php/companies/index?pc=HK&cmpy=9737982
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.cmpy;
  } else if (/^\/php\/companies\/index\/keystatsbox$/i.test(path) && param.excel === '1') {
    // https://www.emis.com/php/companies/index/keystatsbox?pc=HK&cmpy=9737982&hideValues=&currency=HKD&display_units=3&excel=1&tbl=keystats-page-table-exchange
    result.rtype    = 'DATASET';
    result.mime     = 'XLS';
    result.unitid   = param.cmpy;
  } else if (/^\/php\/search\/searchv2$/i.test(path)) {
    // https://www.emis.com/php/search/searchv2
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
