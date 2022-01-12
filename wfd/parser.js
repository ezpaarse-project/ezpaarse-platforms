#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Wanfan data
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const query  = parsedUrl.query || {};
  let match;

  if ((match = /^\/sns\/perio\/([a-z0-9]+)\/?$/i.exec(path)) !== null) {
    // /sns/perio/zggyjj/?tabId=article&publishYear=2021&issueNum=01&page=1&isSync=0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];

    const publishYear = query.publishYear || '-';
    const issueNum    = query.issueNum || '-';
    const page        = query.page || '-';

    result.unitid = `${match[1]}/${publishYear}/${issueNum}/${page}`;

  } else if ((match = /^\/periodical\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /periodical/dlxb202108006
    // /periodical/yywzyy200801001
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/Fulltext\/Download$/i.test(path) && /^perio_/.test(query.fileId)) {
    // /Fulltext/Download?fileId=perio_yywzyy200801001
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = query.fileId.replace(/^perio_/, '');

  } else if (/^\/www\/[^/]+\.ashx$/i.test(path) && query.type === 'perio' && query.resourceId) {
    // /www/%E8%AF%AD%E8%A8%80%E5%8A%9F%E8%83%BD%E8%A7%84%E5%88%92%E5%88%8D%E8%AE%AE.ashx?isread=true&type=perio&resourceId=yywzyy200801001
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = query.resourceId;
  }

  return result;
});
