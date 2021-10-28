#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme American Meteorological Society
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

  if ((match = /^\/loi\/([a-z]+)$/i.exec(path)) !== null) {
    // http://journals.ametsoc.org/loi/bams
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // http://journals.ametsoc.org/toc/bams/96/7
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /^\/doi\/([a-z]+)\/([0-9.]+\/(([A-Z]+)-[A-Z]+-[0-9]+-[0-9.]+))$/i.exec(path)) !== null) {
    // http://journals.ametsoc.org/doi/abs/10.1175/BAMS-D-13-00212.1
    result.doi    = match[2];
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
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'suppl':
      result.rtype = 'SUPPL';
      result.mime  = 'MISC';
      break;
    }

  } else if ((match = /^\/action\/([a-z]+)$/i.exec(path)) !== null) {
    // http://journals.ametsoc.org/action/showFullPopup?id=fig1&doi=10.1175%2FBAMS-D-13-00212.1
    result.rtype = 'IMAGE';
    result.mime  = 'MISC';
    result.doi   = param.doi;

    if (param.doi) {
      result.unitid = param.doi.split('/')[1];
    }
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-.]+)\.xml$/i.exec(path)) !== null && param.tab_body == 'pdf') {
    // https://journals.ametsoc.org/view/journals/amsm/59/1/amsmonographs-d-18-0005.1.xml?tab_body=pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/downloadpdf\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-.]+)\.xml$/i.exec(path)) !== null) {
    // https://journals.ametsoc.org/view/journals/amsm/59/1/amsmonographs-d-18-0005.1.xml?tab_body=pdf
    // https://journals.ametsoc.org/downloadpdf/journals/amsm/59/1/amsmonographs-d-18-0005.1.xml
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-.]+)\.xml$/i.exec(path)) !== null && (param.tab_body == 'fulltext-display' || param.tab_body == null)) {
    // https://journals.ametsoc.org/view/journals/amsm/59/1/amsmonographs-d-18-0005.1.xml?tab_body=fulltext-display
    // https://journals.ametsoc.org/view/journals/amsm/59/1/amsmonographs-d-18-0009.1.xml
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/[a-z]+-([a-z0-9-.]+)\.jpg$/i.exec(path)) !== null) {
    // https://journals.ametsoc.org/view/journals/amsm/59/1/full-amsmonographs-d-18-0005.1-f2.jpg
    result.rtype = 'IMAGE';
    result.mime  = 'JPEG';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-.]+)\.xml$/i.exec(path)) !== null && param.tab_body == 'abstract-display') {
    // https://journals.ametsoc.org/view/journals/amsm/59/1/amsmonographs-d-18-0005.1.xml?tab_body=abstract-display
    result.rtype = 'ABS';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];

  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://journals.ametsoc.org/search?q1=clouds
    // https://journals.ametsoc.org/search?access=all&pageSize=10&q1=clouds&sort=relevance&t=apme
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
    if (param.t) {
      result.title_id = param.t;
    }
  }

  return result;
});

