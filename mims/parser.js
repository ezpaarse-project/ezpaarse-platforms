#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mims Online
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

  if ((match = /^\/Search\/(QuickSearch|ImageSearchResult|DrugAlertDetails|CMISummary)\.aspx$/i.exec(path)) !== null) {
    // https://www.mimsonline.com.au/Search/QuickSearch.aspx?ModuleName=Product%20Info&searchKeyword=cyclobenzaprine+hydrochloride
    // https://www.mimsonline.com.au/Search/ImageSearchResult.aspx?ModuleName=Pill%20ID&searchKeyword=&PreviousPage=&SearchType=Approximate&ID=&QueryComponent=ImageAdvancedSearchNonTokenizedQueryInput
    // https://www.mimsonline.com.au/Search/DrugAlertDetails.aspx?ModuleName=Drug%20Interactions&searchKeyword=muscle+relaxant
    // https://www.mimsonline.com.au/Search/CMISummary.aspx?ModuleName=CMI&searchKeyword=Muscle+Melt+Balm
    if (match[1]) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/Search\/AbbrPI\.aspx$/i.exec(path)) !== null) {
    // https://www.mimsonline.com.au/Search/AbbrPI.aspx?ModuleName=Product%20Info&ID=133310001_2
    // https://www.mimsonline.com.au/Search/AbbrPI.aspx?ModuleName=Product%20Info&ID=132940001_2
    // https://www.mimsonline.com.au/Search/AbbrPI.aspx?ModuleName=Product%20Info&ID=133310003_2
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.ID;
    result.unitid   = param.ID;
  } else if ((match = /^\/Search\/ManufacturerDetails\.aspx$/i.exec(path)) !== null) {
    // https://www.mimsonline.com.au/Search/ManufacturerDetails.aspx?ModuleName=Product%20Info&searchKeyword=&PreviousPage=&SearchType=&ID=133310003_2
    // https://www.mimsonline.com.au/Search/ManufacturerDetails.aspx?ModuleName=Product%20Info&searchKeyword=&PreviousPage=&SearchType=&ID=132700001_2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.ID;
    result.unitid   = param.ID;
  }

  return result;
});
