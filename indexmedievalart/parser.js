#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Index of Medieval Art
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  //  let match;

  if (/^\/([a-z])\/view\/View([a-zA-Z0-9]+).action?$/i.test(path)) {
    // https://theindex.princeton.edu:443/s/view/ViewLanguage.action?id=54F4F8DA-5A9E-426E-A7EB-5ADB7F2DE9DA
    // https://theindex.princeton.edu:443/s/view/ViewExternalReference.action?id=1EF3907B-BE7B-413E-9225-3DB764707EEC
    // https://theindex.princeton.edu:443/s/view/ViewExternalReferenceSource.action?id=89F634C8-75A3-4E73-B271-1654C633FD45
    // https://theindex.princeton.edu:443/s/view/ViewWorkOfArt.action?id=E512F406-A94C-4D7C-9611-165AA4054DA5
    // https://theindex.princeton.edu:443/s/view/ViewIllustrationType.action?id=D566D8A8-D87D-4696-A0A2-3F974F98501A
    // https://theindex.princeton.edu:443/s/view/ViewLocation.action?id=30FAC388-6F0B-45D4-8381-37A1CF94AC75
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = param.id;

  } else if ((/^\/([a-z])\/(Search|Browse)([a-zA-Z0-9]+).action?$/i.exec(path)) || (/^\/([a-z])\/list\/List([a-zA-Z0-9]+).action?$/i.test(path))) {
    // https://theindex.princeton.edu:443/s/SearchWorksOfArt.action
    // https://theindex.princeton.edu:443/s/BrowseSubjectClassifications.action
    // https://theindex.princeton.edu:443/s/list/ListLanguages.action
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';
  }

  return result;
});
