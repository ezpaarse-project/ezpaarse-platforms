#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Editorial Estudio
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path = parsedUrl.pathname;
  const param = parsedUrl.query || {};

  // BOOK_SECTION: /reader/{book-id}?location={page}
  const bookSectionMatch = /^\/reader\/([a-z0-9-]+)$/i.exec(path);
  if (bookSectionMatch && param.location) {
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.title_id = bookSectionMatch[1];
    result.unitid = `${bookSectionMatch[1]}?location=${param.location}`;
    result.first_page = param.location;
  }
  // BOOK: /reader/{book-id}
  else if (bookSectionMatch) {
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = bookSectionMatch[1];
    result.unitid = bookSectionMatch[1];
  }
  // METADATA: /api/v1/library-issue/{id}
  else if (/^\/api\/v1\/library-issue\/[0-9]+$/i.test(path)) {
    const metadataMatch = /^\/api\/v1\/library-issue\/([0-9]+)$/i.exec(path);
    result.rtype = 'METADATA';
    result.mime = 'JSON';
    result.unitid = metadataMatch[1];
  }
  // METADATA: /api/v1/reader/last-location/{id}
  else if (/^\/api\/v1\/reader\/last-location\/[0-9]+$/i.test(path)) {
    const metadataMatch = /^\/api\/v1\/reader\/last-location\/([0-9]+)$/i.exec(path);
    result.rtype = 'METADATA';
    result.mime = 'JSON';
    result.unitid = metadataMatch[1];
  }
  // TOC: /library/my-publications
  else if (/^\/library\/my-publications$/i.test(path)) {
    result.rtype = 'TOC';
    result.mime = 'HTML';
  }
  // TOC: /library/
  else if (/^\/library\/?$/i.test(path)) {
    result.rtype = 'TOC';
    result.mime = 'HTML';
  }
  // SEARCH: /library/search/{query}
  else if (/^\/library\/search\/.+$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
