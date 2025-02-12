#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ebsco Host 2025
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/api\/search\/v[0-9]+\/search$/i.exec(path)) !== null) {
    // /api/search/v1/search?applyAllLimiters=true&includeSavedItems=false
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/c\/[a-z0-9]+\/search\/details\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /c/dgznfn/search/details/w2sj2vnexn?db=asn&isDashboardExpanded=false&limiters=None&q=brain
    // /c/kczqeg/search/details/seiqme3mwr?db=kah%2Cmlf&isDashboardExpanded=false&limiters=None&q=A14
    // /c/cp44gr/search/details/nsywpxxlmv?db=nlebk
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.db_id    = param.db;
  } else if ((match = /^\/api\/search\/v[0-9]+\/details$/i.exec(path)) !== null) {
    // /api/search/v2/details?recordId=w2sj2vnexn&profileIdentifier=dgznfn
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.recordId;
  } else if ((match = /^\/c\/[a-z0-9]+\/viewer\/(pdf|html)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /c/dgznfn/viewer/pdf/w2sj2vnexn
    // /c/kczqeg/viewer/pdf/zcsn4yhmbv
    // /c/kczqeg/viewer/html/zcsn4yhmbv
    result.rtype    = 'ARTICLE';
    result.mime     = match[1].toUpperCase();
    result.unitid   = match[2];
    result.db_id    = param.db;
  } else if ((match = /^\/api\/viewer\/v[0-9]+\/(details|htmlfulltext)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /api/viewer/v5/details/w2sj2vnexn?opid=dgznfn
    // /api/viewer/v6/htmlfulltext/w2sj2vnexn?opid=dgznfn
    result.rtype    = 'ARTICLE';
    result.mime     = match[1] === 'htmlfulltext' ? 'HTML' : 'PDF';
    result.unitid   = match[2];
  } else if ((match = /^\/EbscoViewerService\/ebook$/i.exec(path)) !== null) {
    // /EbscoViewerService/ebook?an=157704&callbackUrl=https%3a%2f%2fresearch.ebsco.com&db=nlebk&format=EK&profId=eds&lpid=&ppid=&lang=fr&location=https%3a%2f%2fresearch-ebsco-com.ezproxy.unilim.fr%2fc%2fcp44gr%2fsearch%2fdetails%2fnsywpxxlmv%3fdb%3dnlebk&isPLink=False&requestContext=&profileIdentifier=cp44gr&recordId=nsywpxxlmv
    // /EbscoViewerService/ebook?an=157704&callbackUrl=https%3a%2f%2fresearch.ebsco.com&db=nlebk&format=EB&profId=eds&lpid=&ppid=&lang=fr&location=https%3a%2f%2fresearch-ebsco-com.ezproxy.unilim.fr%2fc%2fcp44gr%2fsearch%2fdetails%2fnsywpxxlmv%3fdb%3dnlebk&isPLink=False&requestContext=&profileIdentifier=cp44gr&recordId=nsywpxxlmv
    result.rtype    = 'BOOK';
    result.mime     = param.format === 'EB' ? 'PDF' : 'HTML';
    result.unitid   = param.recordId;
    result.db_id    = param.db;
  }

  return result;
});
