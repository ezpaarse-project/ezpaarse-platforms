#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiPrefix = '10.4337';

/**
 * Recognizes the accesses to the platform Elgaronline
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/view\/journals\/([a-z]+)\/[0-9-]+\/([a-z]+\.([0-9]+)\.([0-9]+)\.issue-([0-9]+))\.xml$/i.exec(path)) !== null) {
    // /view/journals/clj/20-4/clj.2021.20.issue-4.xml
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
    result.publication_date = match[3];
    result.vol = match[4];
    result.issue = match[5];

  } else if ((match = /^(?:\/downloadpdf)?\/view\/journals\/(([a-z]+)\/([0-9]+)\/([0-9]+)\/article-p([0-9]+))\.(xml|pdf)$/i.exec(path)) !== null) {
    // /view/journals/clj/23/3/article-p148.xml
    // /downloadpdf/view/journals/clj/23/3/article-p137.pdf
    result.rtype = 'ARTICLE';
    result.mime = match[6] === 'pdf' ? 'PDF' : 'HTML';
    result.title_id = match[2];
    result.unitid = match[1];
    result.vol = match[3];
    result.issue = match[4];
    result.first_page = match[5];

  } else if ((match = /^(?:\/downloadpdf)?\/edcollchap-oa\/edcoll\/([0-9X]+)\/([0-9X.]+)\.(pdf|xml)$/i.exec(path)) !== null) {
    // /edcollchap-oa/edcoll/9781788118187/9781788118187.00011.xml
    // /downloadpdf/edcollchap-oa/edcoll/9781788118187/9781788118187.00011.pdf
    result.rtype = 'BOOK_SECTION';
    result.mime = match[3] === 'pdf' ? 'PDF' : 'HTML';
    result.unitid = match[2];
    result.online_identifier = match[1];
    result.doi = `${doiPrefix}/${result.unitid}`;

  // } else if ((match = /^(?:\/downloadpdf)?\/display\/book\/(([0-9X]+)\/(?:b-)?([0-9X]+|chapter[0-9]+))\.(pdf|xml)$/i.exec(path)) !== null) {
  } else if ((match = /^(?:\/downloadpdf)?\/display\/book\/((97[0-9X]+)\/(?:b-)?([a-z0-9_.-]+))\.(pdf|xml)$/i.exec(path)) !== null) {
    // /display/book/9781800886933/b-9781800886933.african.intellectual.property.organization.xml
    // /display/book/9781803920924/book-part-9781803920924-38.xml
    // /display/book/9781800886933/9781800886933.xml
    // /display/book/9781035306459/chapter36.xml
    // /downloadpdf/display/book/9781035306459/chapter36.pdf
    result.rtype = match[2] === match[3] ? 'TOC' : 'BOOK_SECTION';
    result.mime = match[4] === 'pdf' ? 'PDF' : 'HTML';
    result.online_identifier = match[2];

    if (/^97[89]/.test(match[3])) {
      result.unitid = match[3];
      result.doi = `${doiPrefix}/${result.unitid}`;
    } else {
      result.unitid = match[1];
    }

  } else if ((match = /^(?:\/downloadpdf)?\/monochap\/(([0-9X]+)\.[0-9]+)\.(pdf|xml)$/i.exec(path)) !== null) {
    // /monochap/9781849808606.00008.xml
    // /downloadpdf/monochap/9781849808606.00008.pdf
    result.rtype = 'BOOK_SECTION';
    result.mime = match[3] === 'pdf' ? 'PDF' : 'HTML';
    result.unitid = match[1];
    result.online_identifier = match[2];
    result.doi = `${doiPrefix}/${result.unitid}`;
  }

  return result;
});
