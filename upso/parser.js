#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform upso
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

  let match;

  if (/^\/search$/i.test(path)) {
    // http://www.universitypressscholarship.com:80/search?q=plato&searchBtn=Search&isQuickSearch=true
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/browse$/i.test(path)) {
    // http://www.universitypressscholarship.com:80/browse?t=OSO:history
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/view\/((.*)\/(.*)\/(.*?)\.(.*?)\.(.*))\/(.*)$/i.exec(path)) !== null) {
    // http://yale.universitypressscholarship.com:80/view/10.12987/yale/9780300087574.001.0001/upso-9780300087574?rskey=TVk77B&result=2
    // http://yale.universitypressscholarship.com.proxy.library.emory.edu/view/10.12987/yale/9780300087574.001.0001/upso-9780300087574-chapter-2
    // http://www.oxfordscholarship.com:80/view/10.1093/acprof:oso/9780198068334.001.0001/acprof-9780198068334-chapter-1?print=pdf
    if (param.result) {
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    } else if (param.print === 'pdf') {
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'PDF';
    } else {
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'HTML';
    }
    result.doi      = match[1];
    result.print_identifier = match[4];
    result.unitid   = match[7];
  } else if ((match = /^\/newsitem\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.universitypressscholarship.com:80/newsitem/677/princeton-scholarship-online-is-now-available
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
