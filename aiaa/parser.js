#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Institute of Aeronautics and Astronautics
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

  if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://arc.aiaa.org/action/doSearch?AllField=Ion+Thruster
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/doi\/pdf\/(.+)$/i.exec(path)) !== null) {
    // https://arc.aiaa.org/doi/pdf/10.2514/1.B37166 
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/(.+)$/i.exec(path)) !== null) {
    // https://arc.aiaa.org/doi/10.2514/1.B37166
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
