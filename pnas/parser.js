#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Proceedings of the National Academy of Sciences
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

  if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /toc/pnas/118/47
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[2];
    result.unitid = match[1];

  } else if ((match = /^\/toc\/([a-z]+\/[a-z]+)$/i.exec(path)) !== null) {
    // /loi/pnas/current
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/loi\/([a-z]+)$/i.exec(path)) !== null) {
    // /loi/pnas
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/doi\/epdf\/(10.[0-9]{4}\/([a-z]+.[0-9]+))$/i.exec(path)) !== null) {
    // /doi/epdf/10.1073/pnas.2118210119
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[2];
    result.doi = match[1];

  } else if ((match = /^\/doi\/(10.[0-9]{4}\/([a-z]+.[0-9]+))$/i.exec(path)) !== null) {
    // /doi/10.1073/pnas.2118210119
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.doi = match[1];
  }


  return result;
});
