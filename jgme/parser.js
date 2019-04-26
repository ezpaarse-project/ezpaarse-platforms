#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Graduate Medical Education
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/toc\/jgme\/([0-9]+)\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.jgme.org:443/toc/jgme/11/1
    // https://www.jgme.org:443/toc/jgme/3/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9.]+)\/([a-zA-Z0-9.-]+)$/i.exec(path)) !== null) {
    // https://www.jgme.org:443/doi/abs/10.4300/JGME-D-11-00027.1
    // https://www.jgme.org:443/doi/full/10.4300/JGME-D-18-01093.1
    // https://www.jgme.org:443/doi/pdf/10.4300/JGME-D-18-01093.1
    if (match[1] == 'abs') {
      result.rtype = 'ABS';
      result.mime = 'HTML';
    }
    if (match[1] == 'full') {
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    }
    if (match[1] == 'pdf') {
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
    }
    result.doi      = match[2] + '/' + match[3];
    result.unitid   = match[2] + '/' + match[3];
  } else if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://www.jgme.org:443/action/doSearch?AllField=brain
    // https://www.jgme.org:443/action/doSearch?displaySummary=true&Contrib=&Title=&Keyword=toddler&AllField=brain&Abstract=&PubIdSpan=&AfterMonth=&AfterYear=&BeforeMonth=&BeforeYear=&search=Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/na101\/home\/literatum\/publisher\/pinnacle\/journals\/content\/jgme\/([0-9]+)\/([0-9-.]+)\/([a-zA-Z0-9.-]+)\/([0-9]+)\/images\/([a-z]+)\/([a-zA-Z0-9.-]+)$/i.exec(path)) !== null) {
    // https://www.jgme.org:443/na101/home/literatum/publisher/pinnacle/journals/content/jgme/2019/19498357-11.1/jgme-d-18-01093.1/20190211/images/large/i1949-8357-11-1-1-f02.jpeg
    // https://www.jgme.org:443/na101/home/literatum/publisher/pinnacle/journals/content/jgme/2019/19498357-11.1/jgme-d-18-01093.1/20190211/images/large/i1949-8357-11-1-1-t01.jpeg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.title_id = match[3];
    result.unitid   = match[6];
  } else if ((match = /^\/page\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.jgme.org:443/page/medical-education-papers-worth-reading
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
