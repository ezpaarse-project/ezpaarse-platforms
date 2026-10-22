#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result = {};
  const path   = parsedUrl.pathname;
  const query = parsedUrl.query || {};
  let match;

  if (/^\/Content\/(Document|DocumentView|Revues)\.aspx$/i.test(path)) {
    // /Content/DocumentView.aspx
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';


  } else if (/^\/Content\/RevuesGroup\.aspx$/i.test(path)) {
    // /Content/RevuesGroup.aspx
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if (/^\/Content\/PageViewPDF\.aspx$/i.test(path)) {
    // /Content/PageViewPDF.aspx
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

  } else if (/^\/Content\/[a-z0-9.-]+\.Export\.ashx$/i.test(path)) {
    // /Content/undefined.Export.ashx?id=DocumentContent
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

  } else if (/^\/Content\/Archive\.aspx$/i.test(path)) {
    // /Content/Archive.aspx
    result.rtype = 'BOOK';
    result.mime  = 'HTML';

  } else if (/^\/Content\/ResultList\.aspx$/i.test(path)) {
    // /Content/ResultList.aspx
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/my-reader\/([a-z0-9_-]+)$/i.exec(path)) !== null && query.fileName) {
    // /my-reader/TC0000002533_20261013_0?fileName=content%2FCOVER.HTML
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';
    result.unitid = `${match[1]}/${query.fileName}`;
  }

  return result;
});
