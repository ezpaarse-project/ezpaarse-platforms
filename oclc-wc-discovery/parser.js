#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform WorldCat Discovery
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

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://ocpsb.on.worldcat.org/search?sortKey=LIBRARY&databaseList=&queryString=cats&changedFacet=scope&overrideStickyFacetDefault=&selectSortKey=LIBRARY&overrideGroupVariant=&overrideGroupVariantValue=&scope=&format=all&year=all&yearFrom=&yearTo=&author=all&topic=all&database=all&language=all&materialtype=all
    // https://ocpsb.on.worldcat.org/search?sortKey=LIBRARY&databaseList=&queryString=cats&changedFacet=scope&overrideStickyFacetDefault=&selectSortKey=LIBRARY&overrideGroupVariant=&overrideGroupVariantValue=&scope=&format=all&year=all&yearFrom=&yearTo=&author=all&topic=all&database=all&language=all&materialtype=all#/oclc/70775700
    let hashMatch;
    if (parsedUrl.hash && (hashMatch = /^#\/oclc\/([0-9]+)$/i.exec(parsedUrl.hash)) !== null) {
      result.rtype    = 'RECORD';
      result.title_id = hashMatch[1];
      result.unitid = hashMatch[1];
    } else {
      result.rtype    = 'SEARCH';
    }
    result.mime  = 'HTML';

  } else if ((match = /^\/oclc\/([0-9]+)$/i.exec(path)) !== null) {
    // https://ocpsb.on.worldcat.org/oclc/70775700
    result.rtype    = 'RECORD';
    result.title_id = match[1];
    result.unitid = match[1];
    result.mime  = 'HTML';
  } else if ((match = /^\/marcAccess\/([0-9]+)$/i.exec(path)) !== null) {
    // https://ocpsb.on.worldcat.org/marcAccess/70775700
    result.rtype    = 'METADATA';
    result.title_id = match[1];
    result.unitid = match[1];
    result.mime  = 'HTML';
  } else if ((match = /^\/detailed-record\/([0-9]+)$/i.exec(path)) !== null) {
    //https://ocpsb.on.worldcat.org/detailed-record/9854062?databaseList=283
    result.rtype    = 'RECORD';
    result.title_id = match[1];
    result.unitid = match[1];
    result.mime  = 'HTML';
  } else if ((match = /^\/atoztitles\/link$/i.exec(path)) !== null) {
    // https://ocpsb.on.worldcat.org/atoztitles/link?rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&ctx_enc=info%3Aofi%2Fenc%3AUTF-8&rft.pub=Rand+McNally%2C&ctx_tim=2020-09-23T15%3A15%3A03EDT&rft.dat=1&rft.place=Chicago+%3A&rft_id=info%3Aoclcnum%2F1&rfr_id=info%3Asid%2Focpsb.on.worldcat.org%3Axwc&ctx_ver=Z39.88-2004&rft.btitle=The+Rand+McNally+book+of+favourite+pastimes&rft.genre=book&rft.aufirst=Dorothy.&rft.pages=110+pages+%3A&url_ctx_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Actx&rft.aulast=Grider&rfr.id=1&rft.id=1&url_ver=Z39.88-2004&rft.date=[1963]&ctx_id=1&rft_dat={%22stdrt1%22%3A%22Book%22%2C%22stdrt2%22%3A%22PrintBook%22}
    result.rtype    = 'OPENURL';
    result.title_id = param['rft.id'];
    result.unitid = param['rft.id'];
    result.mime  = 'HTML';
  }

  return result;
});
