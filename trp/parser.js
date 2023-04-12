#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Thomson Reuters Proview
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

  if (/^\/catalog\.html$/i.test(path)) {
    // https://proview.thomsonreuters.com/catalog.html#/catalog/anacat/results?keyword=Libel&thesaurus=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/title\.html$/i.test(path)) {
    // https://proview.thomsonreuters.com/title.html?redirect=true&titleKey=SG%2FFULL%2FAISAP2ED%2Fv1.0&titleStage=F&titleAcct=i0ad62976000001746c1a652e25c47ead#sl=p&eid=39fb769eecf451298626b5ec528616c5&eat=&pg=cover&psl=p
    // https://proview.thomsonreuters.com/title.html?redirect=true&titleKey=SG%2FFULL%2FAISAP2ED%2Fv1.0&titleStage=F&titleAcct=i0ad62976000001746c1a652e25c47ead#sl=p&eid=62148b13d108bac08d4131c19365222d&eat=&pg=89&psl=&nvgS=false
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'HTML';
    result.title_id = param.titleKey;
    result.unitid   = param.titleKey;
  } else if (/^\/title$/i.test(path)) {
    // https://next-proview.thomsonreuters.com/title
    result.rtype    = 'QUERY';
    result.mime     = 'HTML';
  }

  return result;
});
