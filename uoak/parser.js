#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Univ OAK : Open Access to Knoledge
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

  if ((match = /^\/islandora\/object\/islandora:([0-9]+)\/datastream\/PDF\/download\/citation\.pdf$/i.exec(path)) !== null) {
    // https://univoak.eu/islandora/object/islandora:53747/datastream/PDF/download/citation.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1];
  } else if ((match = /^\/islandora\/object\/islandora:([0-9]+)\/datastream\/PDF\/view$/i.exec(path)) !== null) {
    // https://univoak.eu/islandora/object/islandora%3A64221/datastream/PDF/view
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/islandora\/object\/islandora:([0-9]+)$/i.exec(path)) !== null) {
    // https://univoak.eu/islandora/object/islandora:80605
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
