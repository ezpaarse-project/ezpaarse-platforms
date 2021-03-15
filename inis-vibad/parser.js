#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform INIS (Vibad)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  if (/^\/vibad\/index.php$/i.test(path)) {
    // /vibad/index.php?action=getRecordDetail&lang=fr&idt=44055665
    // /vibad/index.php?action=search&lang=fr&terms=reacteur
    // /vibad/index.php?action=search&lang=fr&code=S01
    // /vibad/index.php?action=thesaurus&lang=fr&vocabTterms=reactor&vocabLang=&any_fragments=

    switch (param.action) {
    case 'search':
    case 'thesaurus':
    case 'advancedSearch':
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
      break;
    case 'getRecordDetail':
      result.rtype = 'RECORD_VIEW';
      result.mime = 'HTML';
      result.unitid = param.idt;
    }
  }

  return result;
});
