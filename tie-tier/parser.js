#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tie Tier
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/Number_DB\/twnio\/io_ind_stastic\.aspx$/i.test(path) ||
      /^\/Number_DB\/psi\/psi_ind_stastic\.aspx$/i.test(path) ||
      /^\/Number_DB\/mci\/mci_ind_stastic\.aspx$/i.test(path)) {
    result.rtype = 'DATASET';
    result.mime  = 'HTML';
    if (param.industry) { result.unitid = param.industry; }

  } else if (/^\/Number_DB\/Company\/company_ind_stastic\.aspx$/i.test(path)) {
    result.rtype = 'DATASET';
    result.mime  = 'HTML';
    if (param.COID) { result.unitid = param.COID; }

  } else if (/^\/number_db\/company\/rank_pointer\.aspx$/i.test(path) ||
             /^\/number_db\/company\/Search_CPO\.aspx$/i.test(path) ||
             /^\/search\/index\.aspx$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/db\/article\/content\.aspx$/i.test(path)) {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.sid) { result.unitid = param.sid; }

  } else if (/^\/number_db\/twnio\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/psi\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/mci\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/company\/dbmain\.aspx$/i.test(path)) {
    result.rtype = 'DATASET';
    result.mime  = 'HTML';
  }

  return result;
});
