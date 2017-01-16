#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Web of Science
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

  if ((match = /^\/([a-zA-z\_]*)\.do$/i.exec(path)) !== null) {
    //UA_GeneralSearch_input.do?product=UA&SID=Z2E5UA9l6Q6BRAvS44U&search_mode=GeneralSearch
    //Search.do?product=UA&SID=Z2E5UA9l6Q6BRAvS44U&search_mode=GeneralSearch&prID=dcfade3d-550a-4076-92a6-bd6708e2c64c
    //full_record.do?product=UA&search_mode=GeneralSearch&qid=14&SID=Z2E5UA9l6Q6BRAvS44U&page=1&doc=2
    //InterService.do?product=WOS&toPID=WOS&action=AllCitationService&isLinks=yes&highlighted_tab=WOS&last_prod=WOS&fromPID=UA&search_mode=CitedRefList
    switch (match[1]) {
    case 'Search':
    case 'InterService' :
      result.rtype    = 'TOC';
      break;
    case 'UA_GeneralSearch_input' :
    case 'RSCI_GeneralSearch_input' :
    case 'WOS_GeneralSearch_input' :
    case 'CCC_GeneralSearch_input' :
    case 'KJD_GeneralSearch_input' :
    case 'MEDLINE_GeneralSearch_input' :
    case 'SCIELO_GeneralSearch_input' :
      result.rtype    = 'SEARCH';
      break;
    case 'full_record' :
      result.rtype    = 'REF';
      break;
    }

    result.mime = 'HTML';

    if (param && param.product) {
      result.title_id = param.product;
      if (param.product instanceof Array) {
        result.title_id = param.product[0];
      }
    }

  } else if ((match = /^\/([a-zA-z\_]*)\.action$/i.exec(path)) !== null) {
    //JCRJournalHomeAction.action?
    //https://jcr-incites-thomsonreuters-com.inee.bib.cnrs.fr/JCRJournalProfileAction.action?
    //https://esi-incites-thomsonreuters-com.inee.bib.cnrs.fr/IndicatorsAction.action?
    //https://esi-incites-thomsonreuters-com.inee.bib.cnrs.fr/DocumentsAction.action



    switch (match[1]) {
    case 'JCRJournalHomeAction':
      result.rtype = 'TOC';
      result.mime  = 'HTML';
      break;
    case 'JCRJournalProfileAction' :
      result.rtype = 'TABLE';
      result.mime  = 'HTML';
      break;
    case 'IndicatorsAction' :
      result.rtype = 'TABLE';
      result.mime  = 'MISC';
      break;
    case 'DocumentsAction' :
      result.rtype = 'GRAPH';
      result.mime  = 'MISC';
      break;
    }
    if (param && param.journal) {
      result.title_id = param.journal;
    }
    if (param && param.journalTitle) {
      result.unitid   = param.journalTitle;
    }

  }

  return result;
});
