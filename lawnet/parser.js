#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform LawNet
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

  if (/^\/lawnet\/group\/lawnet\/page-content$/i.test(path) && param.pdfFileName) {
    // https://www.lawnet.sg/lawnet/group/lawnet/page-content?p_p_id=legalresearchpagecontent_WAR_lawnet3legalresearchportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=viewPDFSourceDocument&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_documentID=%2FSLR%2F%5B1998%5D+1+SLR%28R%29+0726.xml&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_loadPage=0&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_prevPage=-1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_nextPage=1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_viewType=&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_contentDocID=%2FSLR%2F%5B1998%5D+1+SLR%28R%29+0726.xml&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_queryStr=%28guilty%29&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_implicitModel=true&pdfFileName=[1998]%201%20SLR(R)%200726.pdf&pdfFileUri=/SLR/[1998]%201%20SLR(R)%200726/resource/[1998]%201%20SLR(R)%200726.pdf
    // https://www.lawnet.sg/lawnet/group/lawnet/page-content?p_p_id=legalresearchpagecontent_WAR_lawnet3legalresearchportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=viewPDFSourceDocument&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_documentID=%2FCommentaries%2F63849-M.xml&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_loadPage=0&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_prevPage=-1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_nextPage=1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_viewType=&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_contentDocID=%2FCommentaries%2F63849-M.xml&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_queryStr=%28guilty%29&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_implicitModel=true&pdfFileName=LGUPD_[2009]_RJTN_29_v1.0.pdf&pdfFileUri=/Commentaries/63849-M/resource/LGUPD_[2009]_RJTN_29_v1.0.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param._legalresearchpagecontent_WAR_lawnet3legalresearchportlet_contentDocID.replace(/\.[^/.]+$/, '');
  } else if (/^\/lawnet\/group\/lawnet\/page-content$/i.test(path)) {
    //https://www.lawnet.sg/lawnet/group/lawnet/page-content?p_p_id=legalresearchpagecontent_WAR_lawnet3legalresearchportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_action=openContentPage&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_contentDocID=/APBook/11_SEC_7978d4ef-1a20-46af-88eb-329799352981_Chapter4_SEC1-2.xml&&_legalresearchpagecontent_WAR_lawnet3legalresearchportlet_loadPage=1
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = param._legalresearchpagecontent_WAR_lawnet3legalresearchportlet_contentDocID.replace(/\.[^/.]+$/, '');
  } else if (/^\/SIRWeb\/search\/generategraph$/i.test(path)) {
    // https://www.lawnet.sg/SIRWeb/search/generategraph
    result.rtype    = 'GRAPH';
    result.mime     = 'HTML';
  } else if (/^\/lawnet\/group\/lawnet\/result-page$/i.test(path)) {
    // https://www.lawnet.sg/lawnet/group/lawnet/result-page?p_p_id=legalresearchresultpage_WAR_lawnet3legalresearchportlet&p_p_lifecycle=1&p_p_state=normal&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_action=searchBySearchTrailSearchId&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_enableTrail=false&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_searchId=50269993
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
