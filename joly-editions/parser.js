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
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/WebJolyFO\/rss\/sommaire\/readPdf$/.exec(path)) !== null) {
    // http://www.editions-joly.com/WebJolyFO/rss/sommaire/readPdf?
    // pdfFile=/Weblextenso/La-une-des-revues/pdfnews/BJS-06_2014.pdf
    result.rtype    = 'TOC';
    result.mime     = 'PDF';
    if (param && param.pdfFile) {
      var elements;
      elements = param.pdfFile.match(/(([A-Z]+)\-([0-9_]+))\.pdf/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if ((match = /^\/WebJolyFO\/basejoly\/documentNews$/.exec(path)) !== null) {
    // http://www.editions-joly.com/WebJolyFO/basejoly/documentNews?idDoc=jolynews1096.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (param && param.idDoc) {
      var elements;
      elements = param.idDoc.match(/(([a-z]+)([0-9_]+))\.html/);
      result.title_id = elements[2];
      result.unitid   = elements[1];
    }
  } else if ((match = /^\/WebJolyFO\/document\/viewDocument$/.exec(path)) !== null) {
    // http://www.editions-joly.com/WebJolyFO/document/viewDocument?documentId=EC110
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (param && param.documentId) {
      result.unitid   = param.documentId;
    }
  }

  return result;
});

