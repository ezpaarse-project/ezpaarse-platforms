#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Joly Editions
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};
  var elements;

  if (/^\/WebJolyFO\/rss\/sommaire\/readPdf$/.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/rss/sommaire/readPdf?
    // pdfFile=/Weblextenso/La-une-des-revues/pdfnews/BJS-06_2014.pdf
    result.rtype = 'TOC';
    result.mime  = 'PDF';
    if (param && param.pdfFile) {
      elements = param.pdfFile.match(/(([A-Z]+)\-([0-9_]+))\.pdf/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if (/^\/WebJolyFO\/basejoly\/documentNews$/.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/basejoly/documentNews?idDoc=jolynews1096.html
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    if (param && param.idDoc) {
      elements = param.idDoc.match(/(([a-z]+)([0-9_]+))\.html/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if (/^\/WebJolyFO\/document\/viewDocument$/.test(path)) {
    // http://www.editions-joly.com/WebJolyFO/document/viewDocument?documentId=EC110
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    if (param && param.documentId) {
      result.unitid   = param.documentId;
    }
  }

  return result;
});

