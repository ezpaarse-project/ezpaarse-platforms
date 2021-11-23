#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Duoc Videos
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

  if ((match = /^\/video\/([a-z-0-9]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://videos.duoc.cl/video/DDF-Resumen-EA-2/ed2d5e51865648e43d80378e5c8c2f66    
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/category\/video\/([a-z-]+)\/([a-z-0-9]+)\/[0-9]+$/i.exec(path)) !== null) {
    // https://videos.duoc.cl/category/video/Gestion-de-la-Capacitacion/f371b1a95189db3f94017302e83fc02d/40
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/document\/([a-z-0-9]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://videos.duoc.cl/document/Instructivo-PortafolioVFDIC2019/0bf084e9007b90f034f7885dfa37ae89
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];    
  } else if ((match = /^\/picture\/([a-z-0-9]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://videos.duoc.cl/picture/InfografiaPortafolio/ccc00ab6e8d10b4e3b9960d96a8e5274
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/search\/(.+)$/i.exec(path)) !== null) {
    // https://videos.duoc.cl/search/title/instructivo/description/instructivo/tags/instructivo/type/all/search/basic/categoriesopt/0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
