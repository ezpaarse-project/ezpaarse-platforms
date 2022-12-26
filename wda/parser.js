#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Wiley Digital Archives
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

  let match;

  if ((match = /^\/wiley\/detail\/([a-z0-9-]+);.*$/i.exec(path)) !== null) {
    // https://app.wileydigitalarchives.com/wiley/detail/RAIPFA831-C0001-MA000085;searchTerm=Celts;isFromResultsPage=true;filterParam=%26%26archive%3DBAAS%7CNYAS%7CRAI;start=1
    // https://app.wileydigitalarchives.com/wiley/detail/BSAUFA002-C0001-BO0000100;searchTerm=;isFromResultsPage=true;filterParam=%26%26archive%3DBAAS%7CNYAS%7CRAI;start=0;docID=BSAUFA002-C0001-BO0000100;invokedFrom=%5Bobject%20Object%5D;pageId=
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/wiley\/search;(.*)$/i.exec(path)) !== null) {
    // https://app.wileydigitalarchives.com/wiley/search;searchTerm=Celts;selectedArchives=BAAS,NYAS,RAI
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    let paramStr = match[1].split(';');
    let param_list = {};
    paramStr.map(item=>{
      let keyValue = item.split('=');
      return param_list[keyValue[0]] = keyValue[1];
    });
    result.db_id = param_list.selectedArchives;
  }

  return result;
});
