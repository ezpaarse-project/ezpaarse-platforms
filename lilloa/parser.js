#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lille Open Archive
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

  if ((match = /(^\/bitstream\/handle\/([0-9\.\/]+)\/(.*)\.pdf)$/i.exec(path)) !== null && param.isAllowed == 'y') {
    // https://lilloa.univ-lille.fr/bitstream/handle/20.500.12210/20385.2/Marie%20Glon-OSE.pdf?sequence=1&isAllowed=y
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    //result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/handle\/([0-9\.\/]+)\/restricted-resource$/i.exec(path)) !== null) {
    // https://lilloa.univ-lille.fr/handle/20.500.12210/37541/restricted-resource?bitstreamId=8fb77f9c-e6a8-48fc-81b6-3bccd15495dd
    result.rtype    = 'QUERY';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/handle\/([0-9\.\/]+)$/i.exec(path)) !== null) {
    // https://lilloa.univ-lille.fr/handle/20.500.12210/15129.3
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/rest\/items\/([^/]+)$/i.exec(path)) !== null) {
    // hhttps://lilloa.univ-lille.fr/rest/items/40cfdac6-82da-4f8c-b2fc-cdeb09be4cf3
    result.rtype    = 'METADATA';
    result.mime     = 'XML';
    //result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
