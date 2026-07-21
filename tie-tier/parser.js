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
    // /Number_DB/twnio/io_ind_stastic.aspx?initq=y&industry=C1112&ind_type=detailind&Class=7&iotype=m&year_period=5&data_freq=Y
    // /Number_DB/psi/psi_ind_stastic.aspx?industry=C1612&class=0&ind_Type=detailind&year_period=10&data_freq=Y
    // /Number_DB/mci/mci_ind_stastic.aspx?industry=IO050&ind_type=midind

    result.rtype = 'DATASET';
    result.mime  = 'HTML';
    if (param.industry) { result.unitid = param.industry; }

  } else if (/^\/Number_DB\/Company\/company_ind_stastic\.aspx$/i.test(path)) {
    // /Number_DB/Company/company_ind_stastic.aspx?industry=IND24-13&Class=7&COID=1513
    // /Number_DB/Company/company_ind_stastic.aspx?industry=IND23-12&ind_type=midind&COID=8998&class=1
    result.rtype = 'DATASET';
    result.mime  = 'HTML';
    if (param.COID) { result.unitid = param.COID; }

  } else if (/^\/number_db\/company\/rank_pointer\.aspx$/i.test(path) ||
             /^\/number_db\/company\/Search_CPO\.aspx$/i.test(path) ||
             /^\/search\/index\.aspx$/i.test(path)) {
    // /number_db/company/rank_pointer.aspx?pntClass=2&PointerID=I%2c3100&SearchYear=2021-2026&IndTop=IND12&IndMid=IND12-11&MarketType=all&SearchRank=100&sortOrder=Desc&sid=&urk=
    // /number_db/company/Search_CPO.aspx?pageCount=1&pageTotal=10&QS=1&WDC=1&SKW=1
    // /search/index.aspx?keyword=%E7%BE%8E%E5%85%89
    // /search/index.aspx?keyword=%E8%A7%80%E5%85%89%E7%B6%93%E6%BF%9F
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/db\/article\/content\.aspx$/i.test(path)) {
    // /db/article/content.aspx?sid=0Q091327659103630585
    // /db/article/content.aspx?sid=0Q124307411766340937
    // /db/article/content.aspx?sid=0Q075535619510091777&mainIndustryCategorySIds=0N268817008173771519
    // /db/article/content.aspx?sid=0Q167346370412679143&mainIndustryCategorySIds=0N268817009908237052
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.sid) { result.unitid = param.sid; }

  } else if (/^\/number_db\/twnio\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/psi\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/mci\/dbmain\.aspx$/i.test(path) ||
             /^\/number_db\/company\/dbmain\.aspx$/i.test(path)) {
    // /number_db/twnio/dbmain.aspx
    // /number_db/psi/dbmain.aspx
    // /number_db/mci/dbmain.aspx
    // /number_db/company/dbmain.aspx
    result.rtype = 'DATASET';
    result.mime  = 'HTML';
  }

  return result;
});
