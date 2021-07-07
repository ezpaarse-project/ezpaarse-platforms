#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Safari Books Online
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

  if ((match = /^\/library\/view\/[a-z-]+\/([0-9]+)\/(text|[a-z]+\/xhtml)\/([a-z0-9_-]+)\.xhtml/i.exec(path)) !== null) {
    // /library/view/influence/9780061899874/text/9780061899874_Chapter_1.xhtml
    // /library/view/the-psychology-book/9781465439291/OEBPS/xhtml/PSYBOO022DORMEZ.xhtml
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.online_identifier = match[1];
    result.unitid = match[3];
  }

  return result;
});
