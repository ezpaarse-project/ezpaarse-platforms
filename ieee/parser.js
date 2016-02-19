#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ieee
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  if (/^\/xpl\/(([a-zA-Z]+)\.jsp)/.test(path)) {

    if (param.punumber) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/RecentIssue.jsp?punumber=9754
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/mostRecentIssue.jsp?punumber=6892922
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.punumber;
      result.unitid   = param.punumber;
    } else if (param.arnumber) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?tp=&arnumber=6642333&
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?tp=&arnumber=6648418
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?arnumber=159424
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.title_id = param.arnumber;
      result.unitid   = param.arnumber;
    } else if (param.bkn) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/bkabstractplus.jsp?bkn=6642235
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.bkn;
    }

  } else if (/^\/xpls\/(([a-z]+)\.jsp)/.test(path)) {
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpls/icp.jsp?arnumber=6648418
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpls/icp.jsp?arnumber=6899296
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.arnumber) {
      result.title_id = param.arnumber;
      result.unitid   = param.arnumber;
    }
  } else if (/^\/stamp\/(([a-z]+)\.jsp)/.test(path)) {
   // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?tp=&arnumber=6648418
   // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?arnumber=6899296
   // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?tp=&arnumber=159424

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.arnumber;
    result.unitid   = param.arnumber;

  }

  return result;
});

