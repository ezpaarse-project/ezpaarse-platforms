#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Joly Editions
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let elements;

  if (/^\/WebJolyFO\/rss\/sommaire\/readPdf$/i.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/rss/sommaire/readPdf?
    // pdfFile=/Weblextenso/La-une-des-revues/pdfnews/BJS-06_2014.pdf
    result.rtype = 'TOC';
    result.mime  = 'PDF';

    if (param && param.pdfFile) {
      elements = param.pdfFile.match(/(([A-Z]+)-([0-9_]+))\.pdf/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if (/^\/WebJolyFO\/basejoly\/documentNews$/i.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/basejoly/documentNews?idDoc=jolynews1096.html
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    if (param && param.idDoc) {
      elements = param.idDoc.match(/(([a-z]+)([0-9_]+))\.html/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if (/^\/WebJolyFO\/document\/viewDocument$/i.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/document/viewDocument?documentId=EC110
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    if (param && param.documentId) {
      result.unitid = param.documentId;
    }
  }

  return result;
});

