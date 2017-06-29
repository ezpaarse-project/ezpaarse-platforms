#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme jove
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

  /*if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.pdf)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
*/


  if ((match = /^\/video\/([0-9]+)(\/[a-z0-9\-]+)?$/i.exec(path)) !==null) {
	//http://www.jove.com/video/54732/determination-relative-cell-surface-total-expression-recombinant-ion
    result.unit_id = match[1]+match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
	//result.title_id= match[2];
  }

  else if ((match = /^\/pdf\/([0-9]+)(\/[a-z0-9\-]+)?$/i.exec(path)) !==null) {
///pdf/54732/jove-protocol-54732-determination-relative-cell-surface-total-expression-recombinant-ion
    result.unit_id = match[1]+match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
	//result.title_id= match[2];

  }



/**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */

/*

else if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.html)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }
*/

  return result;
});
