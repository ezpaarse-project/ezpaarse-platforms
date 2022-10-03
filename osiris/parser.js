#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Osiris
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

  if (/^\/version-[0-9]+-[0-9]+-[0-9]+\/home\.serv$/i.test(path)) {
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/home.serv?product=OsirisNeo&
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';

  } else if (/^\/version-[0-9]+-[0-9]+-[0-9]+\/Search\.[A-Za-z]+\.serv$/i.test(path)) {
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/Search.CompanyName.serv?_CID=42&EditSearchStep=true&product=osirisneo&SearchStepId=Current.%7b2caa0661-0cb0-4cd9-9310-8c7a924ddcd3%7d0
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/Search.WorldRegions.serv?_CID=88&EditSearchStep=true&product=osirisneo&SearchStepId=Current.%7bfc4dfda2-5236-4322-aa46-829fb94e7450%7d1
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/Search.QuickSearch.serv?_CID=115&product=osirisneo
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/version-[0-9]+-[0-9]+-[0-9]+\/Report\.serv$/i.test(path)) {
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/Report.serv?_CID=187&product=osirisneo&SeqNr=0
    // https://osiris.r1.bvdinfo.com/version-20220406-2418-22/Report.serv?_CID=217&product=osirisneo&SeqNr=1&HideTab=true&CJD_OpenedLevelsInput=&CJD_DefaultOpenedLevelsInput=CJD_D0L0&CMA_OpenedLevelsInput=&CMA_DefaultOpenedLevelsInput=CMA_D0L0
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  }

  return result;
});
