#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform AMA Manual of Style
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if (/^\/(search|browse)$/i.test(path)) {
    // https://www.amamanualofstyle.com:443/search?btog=chap&isQuickSearch=true&pageSize=20&q=book&sort=relevance&t=AMAMOS_SECTIONS%3Amed-9780195176339-chapter-13
    // https://www.amamanualofstyle.com:443/browse?t1=AMAMOS_SECTIONS%3Amed-9780195176339-chapter-13
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/oso\/search:downloadsearchresultaspdf$/i.test(path)) {
    // https://www.amamanualofstyle.com:443/oso/search:downloadsearchresultaspdf?t1=AMAMOS_SECTIONS%3Amed-9780195176339-chapter-13
    result.rtype    = 'SEARCH';
    result.mime     = 'PDF';

  } else if ((match = /^\/page\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://www.amamanualofstyle.com:443/page/style-quizzes
    // https://www.amamanualofstyle.com:443/page/si-conversion-calculator
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/fileasset\/files\/quizzes\/(.*).pdf$/i.exec(path)) !== null) {
    // https://www.amamanualofstyle.com:443/fileasset/files/quizzes/AMA%20MoS%209-2015%20Quiz.pdf
    // https://www.amamanualofstyle.com:443/fileasset/files/quizzes/References_Answers_final.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (((match = /^\/view\/([0-9.]+)\/([a-z]+)\/([0-9.]+)\/med-([0-9]+)$/i.exec(path)) !== null) || ((match = /^\/view\/([0-9.]+)\/([a-z]+)\/([0-9.]+)\/med-([0-9]+)-chapter-([0-9]+)$/i.exec(path)) !== null)) {
    // https://www.amamanualofstyle.com:443/view/10.1093/jama/9780195176339.001.0001/med-9780195176339
    // https://www.amamanualofstyle.com:443/view/10.1093/jama/9780195176339.001.0001/med-9780195176339-chapter-13
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
    result.doi      = match[1] + '/' + match[2] + '/' + match[3];
    result.print_identifier = match[4];

  } else if ((match = /^\/view\/([0-9.]+)\/([a-z]+)\/([0-9.]+)\/med-([0-9]+)-div([0-9]+)-([0-9]+)$/i.exec(path)) !== null) {
    // https://www.amamanualofstyle.com:443/view/10.1093/jama/9780195176339.001.0001/med-9780195176339-div2-359
    // https://www.amamanualofstyle.com:443/view/10.1093/jama/9780195176339.001.0001/med-9780195176339-div2-371?rskey=IhYxpu&result=4
    // https://www.amamanualofstyle.com:443/view/10.1093/jama/9780195176339.001.0001/med-9780195176339-div2-361?print=pdf
    result.rtype    = 'REF';
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
    result.doi      = match[1] + '/' + match[2] + '/' + match[3];
    result.print_identifier = match[4];
    if (param.print == 'pdf') {
      result.mime   = 'PDF';
    }
    else {
      result.mime   = 'HTML';
    }

  }

  return result;
});
