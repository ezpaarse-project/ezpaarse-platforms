#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ieee
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path = parsedUrl.pathname;
  const param = parsedUrl.query || {};

  if (/^\/hyreadnew\/search_result_journal\.jsp$/i.test(path)) {
    // /hyreadnew/search_result_journal.jsp
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/hyreadnew\/search_detail_journal\.jsp$/i.test(path)) {
    // /hyreadnew/search_detail_journal.jsp?sysid=00001489
    result.rtype = 'TOC';
    result.mime = 'HTML';
    if (param.sysid) {
      result.title_id = parseInt(param.sysid).toString();
    }
  } else if (/^\/hyreadnew\/showfile\.jsp$/i.test(path)) {
    // /hyreadnew/showfile.jsp?sysid=00597664
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    if (param.sysid) {
      result.pii = parseInt(param.sysid).toString();
    }
  } else if (/^\/hyreadnew\/search_detail_new\.jsp$/i.test(path)) {
    // /hyreadnew/search_detail_new.jsp?sysid=00597664
    result.rtype = 'ABS';
    result.mime = 'HTML';
    if (param.sysid) {
      result.pii = parseInt(param.sysid).toString();
    }
  } else if (/^\/hyreadnew\/search_result_new\.jsp$/i.test(path)) {
    // /hyreadnew/search_detail_journal.jsp
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }
  return result;
});