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
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/document\/([0-9]+)$/i.exec(path)) !== null) {
    // /document/8122856
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/xpl\/[a-zA-Z]+\.jsp$/i.test(path)) {
    if (param.punumber) {
      // /xpl/RecentIssue.jsp?punumber=9754
      // /xpl/mostRecentIssue.jsp?punumber=6892922
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.punumber;
      result.unitid   = param.punumber;

    } else if (param.arnumber) {
      // /xpl/articleDetails.jsp?tp=&arnumber=6642333&
      // /xpl/articleDetails.jsp?tp=&arnumber=6648418
      // /xpl/articleDetails.jsp?arnumber=159424
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.title_id = param.arnumber;
      result.unitid   = param.arnumber;

    } else if (param.bkn) {
      // /xpl/bkabstractplus.jsp?bkn=6642235
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.bkn;
      result.unitid   = param.bkn;
    }

  } else if (/^\/xpls\/[a-z]+\.jsp$/i.test(path)) {
    // /xpls/icp.jsp?arnumber=6648418
    // /xpls/icp.jsp?arnumber=6899296
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.arnumber) {
      result.title_id = param.arnumber;
      result.unitid   = param.arnumber;
    }
  } else if (/^\/stamp\/[a-z]+\.jsp$/i.test(path)) {
    // /stamp/stamp.jsp?tp=&arnumber=6648418
    // /stamp/stamp.jsp?arnumber=6899296
    // /stamp/stamp.jsp?tp=&arnumber=159424

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.arnumber;
    result.unitid   = param.arnumber;

  } else if ((match = /^\/[a-z0-9]+\/[0-9]+\/([0-9]+)\/([0-9]+)\.pdf$/i.exec(path)) != null) {
    // /ielx7/85/7478484/07478511.pdf?tp=&arnumber=7478511&isnumber=7478484
    // /ielx2/1089/7625/00316360.pdf?tp=&arnumber=316360&isnumber=7625
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/stampPDF\/[a-zA-Z]+\.jsp$/i.exec(path)) != null) {
    // /stampPDF/getPDF.jsp?tp=&arnumber=872906
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.arnumber;
    result.unitid   = param.arnumber;

  } else if ((match = /^\/courses\/content\/([a-z0-9]+)\/data\/swf/i.exec(path)) != null) {
    // /courses/content/EW1305/data/swf/
    result.rtype  = 'ONLINE_COURSE';
    result.mime   = 'FLASH';
    result.unitid = match[1];

  } else if ((match = /^\/courses\/details\/([a-z0-9]+)/i.exec(path)) != null) {
    // /courses/details/EDP305
    result.rtype  = 'ABS';
    result.mime   = 'MISC';
    result.unitid = match[1];
  }

  return result;
});

