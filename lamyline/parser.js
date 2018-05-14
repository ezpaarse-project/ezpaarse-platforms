#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result = {};
  const path   = parsedUrl.pathname;

  if (/\/Content\/(Document|DocumentView|Revues)\.aspx$/i.test(path)) {
    // /Content/DocumentView.aspx
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

  } else if (/\/Content\/PageViewPDF\.aspx$/i.test(path)) {
    // /Content/PageViewPDF.aspx
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

  } else if (/\/Content\/[a-z0-9.-]+\.Export\.ashx$/i.test(path)) {
    // /Content/undefined.Export.ashx?id=DocumentContent
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

  } else if (/\/Content\/Archive\.aspx$/i.test(path)) {
    // /Content/Archive.aspx
    result.rtype = 'BOOK';
    result.mime  = 'HTML';

  }

  return result;
});
