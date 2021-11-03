#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Biblioteca
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

  if ((match = /^\/bdigital\/([a-z0-9]+)\/([a-z0-9]+-(.+?))\/[0-9]+\/$/i.exec(path)) !== null) {
    //http://biblioteca.duoc.cl/bdigital/elibros/a47198-Practical%20Audio/94/
    //http://biblioteca.duoc.cl/bdigital/elibros/a47198-Practical%20Audio/98/
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'HTML';
    result.db_id = match[1];
    result.title_id = match[3];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/bdigital\/([a-z0-9]+)\/([a-z]+)\/([a-z0-9]+)\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    //http://biblioteca.duoc.cl/bdigital/guiasdeclases/ingenieria/MNH2101/Guia4.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.db_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[4];
    result.pii = match[2];
    result.issue = match[3];
  }

  return result;
});
