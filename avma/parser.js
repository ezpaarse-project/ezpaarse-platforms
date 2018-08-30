#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Veterinary Medical Association
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // https://avmajournals.avma.org:443/doi/abs/10.2460/javma.251.1.80
  // https://avmajournals.avma.org/doi/10.2460/ajvr.78.3.279
  if ((match = /\/doi\/(?:(abs|pdfplus|pdf|full)\/)?(10\.[0-9]+\/(.+))$/i.exec(path)) !== null) {
    result.doi = match[2];
    result.unitid = match[3];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    case 'full':
    case undefined:
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    default:
      result.mime = 'HTML';
    }
  }

  // https://avmajournals.avma.org:80/toc/javma/250/8
  // https://avmajournals.avma.org:443/loi/ajvr
  else if ((match = /^\/(?:loi|toc)\/((javma|ajvr)(?:\/([0-9]+)\/([0-9]+))?)$/i.exec(path)) !== null) {
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

    if (match[3]) { result.vol = match[3]; }
    if (match[4]) { result.issue = match[4]; }

    switch (result.title_id) {
    case 'javma':
      result.publication_title = 'Journal of the American Veterinary Medical Association';
      break;
    case 'ajvr':
      result.publication_title = 'American Journal of Veterinary Research';
      break;
    }
  }

  // https://avmajournals.avma.org:443/action/showCitFormats?doi=10.2460%2Fjavma.252.5.565
  else if ((match = /^\/action\/showCitFormats$/i.exec(path)) !== null) {
    result.doi   = param.doi;
    result.mime  = 'RIS';
    result.rtype = 'METADATA';

    let doiMatch = /^10\.[0-9]+\/([a-z0-9.]+)$/i.exec(result.doi);
    if (doiMatch) {
      result.unitid = doiMatch[1];
    }
  }

  // http://avmajournals.avma.org:80/doi/suppl/10.2460/ajvr.76.10.869/suppl_file/14-09-0246r%20suppl.pdf
  // http://avmajournals.avma.org:80/doi/suppl/10.2460/ajvr.78.1.69
  if ((match = /\/doi\/suppl\/(10\.[0-9]+\/([a-z0-9.]+))(\/suppl_file\/.+\.([a-z0-9]{2,4}))?$/i.exec(path)) !== null) {
    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype = 'SUPPL';

    switch (match[4]) {
    case 'pdf':
      result.mime = 'PDF';
      break;
    case 'mp4':
    case 'mov':
      result.mime = 'MISC';
      break;
    default:
      result.mime = 'HTML';
      break;
    }
  }

  return result;
});
