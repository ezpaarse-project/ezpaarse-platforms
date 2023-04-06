#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Thesaurus Linguae Latinae
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;


  if ((match = /^\/article\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://tll.degruyter.com/article/O_2_1_Capra_2_v2007?nextPackageFileName=O_2_1_Capra_3_v2007&nextPackageType=Article&currentIndex=1&search_url=%252Fresults%253Ftype%253D0%2526field0%253D0%2526val0%253Dcapra%2526searchId%253Dc
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/backend\/cite\/download\/[a-z]+\/([a-z0-9_-]+)\.xml$/i.exec(path)) !== null) {
    // https://tll.degruyter.com/backend/cite/download/citations/O_2_1_Capra_2_v2007.xml?languageCode=en
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if (/^\/results$/i.test(path)) {
    // https://tll.degruyter.com/results?type=0&field0=0&val0=capra&searchId=c
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  }

  return result;
});
