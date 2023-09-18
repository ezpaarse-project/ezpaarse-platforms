#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Enciclonet
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/articulo\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://www.enciclonet.com/articulo/huizinga-johan/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (/^\/busqueda$/i.test(path)) {
    // https://www.enciclonet.com/busqueda?q=Erasmo+de+Rotterdam
    // https://www.enciclonet.com/busqueda?q=Ciencias+de+la+Tierra&t=0&f=fisica
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
