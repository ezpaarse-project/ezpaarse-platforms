#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scopus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};

  if (/^\/affil\/profile\.ur[il]$/i.test(path)) {
    // /affil/profile.uri?afid=60008134
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = param.afid;

  } else if (/^\/results\/(affiliationResults|authorNamesList|results)\.ur[il]$/i.test(path)) {
    // /results/affiliationResults.uri
    // /results/authorNamesList.uri
    // /results/results.uri
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/results\/citedbyresults\.ur[il]$/i.test(path)) {
    // /results/citedbyresults.url?cite=2-s2.0-84863856522
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = param.cite;

  } else if (/^\/authid\/detail\.ur[il]$/i.test(path)) {
    // /authid/detail.uri?authorId=36466935500&eid=2-s2.0-85089817481
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = param.eid;

  } else if (/^\/record\/display\.ur[il]$/i.test(path)) {
    // /record/display.uri?eid=2-s2.0-85089817481
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = param.eid;

  } else if (/^\/record\/pubmetrics\.ur[il]$/i.test(path)) {
    // /record/pubmetrics.uri?eid=2-s2.0-84916942935
    result.rtype  = 'ANALYSIS';
    result.mime   = 'HTML';
    result.unitid = param.eid;

  } else if (/^\/record\/pdfdownload\.ur[il]$/i.test(path)) {
    // /record/pdfdownload.uri?eid=2-s2.0-84952777090
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'PDF';
    result.unitid = param.eid;

  }

  return result;
});
