#!/usr/bin/env node
'use strict';

let Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Archives Direct - Adam Matthew Digital
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param  = parsedUrl.query || {};

  let match;
  // http://www.archivesdirect.amdigital.co.uk/CP_Africa
  // http://www.archivesdirect.amdigital.co.uk/CP_MiddleEast

  if (param && param.searchId) {
    // http://www.archivesdirect.amdigital.co.uk/Documents/Search?searchId=bf194253-5f69-42d6-8eae-594905b30720&referrer=&keepFilters=true
    result.rtype  = 'SEARCH';
    result.mime   = 'MISC';
    result.unitid = param.searchId;

  } else if (param && param.documentid) {
    // http://www.archivesdirect.amdigital.co.uk/Download/FullDownload?file=FO_401_11\FO_401_11.pdf&documentid=FO_401_11
    // http://www.archivesdirect.amdigital.co.uk/Download?type=DocumentDetails&documentid=FO_401_11
    // http://www.archivesdirect.amdigital.co.uk/Download/FullDownload?file=FO 407_134\FO 407_134.pdf&documentid=FO 407_134
    // http://www.archivesdirect.amdigital.co.uk/Download?type=DocumentDetails&documentid=FO%20407_134&indexStart=0&indexEnd=0
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = param.documentid;
    let titleID = param.documentid;
    if (titleID) {
      titleID = titleID.replace('%20', ' ');
      titleID = titleID.substring(0, 2) + ' ' + titleID.substring(3, titleID.length).replace('_', '/');
      result.title_id = titleID;
    }

  } else if ((match = /^\/Documents\/(Details|SearchDetails)\/(.*)$/i.exec(path)) !== null) {
    // http://www.archivesdirect.amdigital.co.uk/Documents/SearchDetails/CO_879_167
    // http://www.archivesdirect.amdigital.co.uk/Documents/Details/FO_401_2
    // http://www.archivesdirect.amdigital.co.uk/Documents/SearchDetails/FO 407_117
    // http://www.archivesdirect.amdigital.co.uk/Documents/Details/FO 481_15
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';
    result.unitid = match[2];
    let titleID = match[2];
    if (titleID) {
      titleID = titleID.replace('%20', ' ');
      titleID = titleID.substring(0, 2) + ' ' + titleID.substring(3, titleID.length).replace('_', '/');
      result.title_id = titleID;
    }
  } else if ((match = /\/Image\/(.*)$/i.exec(path)) !== null) {
    // http://www.globalcommodities.amdigital.co.uk:80/FurtherResources/VisualResources/Image/TNA_POWE_33_287/131
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }

  return result;
});
