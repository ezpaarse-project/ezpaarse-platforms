#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform British Pharmacopoeia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;
  if ((match = /^\/monographs\/([0-9a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.pharmacopoeia.com/monographs/Phenylephrine-Eye-Drops.pdf
    result.rtype = 'REPORT';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if (/^\/$/i.test(path) || /^\/search$/i.test(path)) {
    // https://www.pharmacopoeia.com?text=eye
    // https://www.pharmacopoeia.com/search?text=eye
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/[0-9a-z-]+\/[a-z]+\/([a-z-]+)\.html$/i.exec(path)) !== null) {
    // https://www.pharmacopoeia.com/bp-2023/surgical/absorbent-viscose-wadding.html?date=2023-01-01
    result.rtype = 'ISSUE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.pharmacopoeia.com/BP2023?utm_source=TSO&utm_medium=Carousel&utm_campaign=Just+Published+23&utm_id=Just+Published+
    result.rtype = 'ISSUE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/Catalogue\/ProductDetails$/i.test(path)) {
    // https://www.pharmacopoeia.com/Catalogue/ProductDetails?productid=1000015262&page=1&pageSize=20&searchText=&startsWith=
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = param.productid;
  }

  return result;
});
