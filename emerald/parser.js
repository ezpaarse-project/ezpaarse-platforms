#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Emerald management ejournals archives et Business
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/series\/([a-z]+)$/.exec(path)) !== null) {
    // http://www.emeraldinsight.com/series/ail
    result.rtype    = 'BOOKSERIE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = 'series/' +match[1];
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4,5})\/(([A-Z]{1})([0-9]+)([-])([0-9]+)[(]([0-9]{4})[)]([0-9]+))$/.exec(path)) !== null) {
    //http://www.emeraldinsight.com/doi/book/10.1108/S0065-2830%282012%2935

    if (match[1] === 'abs') {
      result.rtype    = 'ABS';
      result.mime     = 'MISC';
    } else if (match[1] === 'book') {
      result.rtype    = 'BOOKSERIE';
      result.mime     = 'MISC';
    } else if (match[1] === 'full') {
      result.mime     = 'HTML';
      result.rtype    = 'ARTICLE';
    } else if (match[1] === 'pdfplus') {
      result.mime     = 'PDFPLUS';
      result.rtype    = 'ARTICLE';
    } else {
      result.rtype    = 'ARTICLE';
      result.mime     = 'MISC';
    }

    result.publication_date= match[8];
    result.title_id = match[5] +match[6] +match[7];
    //see the comment block above
    result.unitid =result.doi  = match[2] + '/' + match[3];
  } else if ((match = /^\/loi\/([a-z]+)$/.exec(path)) !== null) {
    // http://www.emeraldinsight.com/loi/ejim

    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = 'loi/' +match[1];
  } else if ((match = /^\/toc\/([a-z]+)\/([0-9]+)\/([0-9]+)/.exec(path)) !== null) {
    // http://www.emeraldinsight.com/toc/ejim/18/3
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + '/' + match[2] + '/'+ match[3];
  }  else if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4,5})\/(([A-Z]+)([-])([0-9]+)([-])([0-9]+)([-])([0-9]+))$/.exec(path)) !== null) {
  //  http://www.emeraldinsight.com/doi/abs/10.1108/EJIM-10-2013-0115

    if (match[1] === 'abs') {
      result.rtype    = 'ABS';
      result.mime     = 'MISC';
    } else if (match[1] === 'full') {
      result.mime     = 'HTML';
      result.rtype    = 'ARTICLE';
    } else if (match[1] === 'pdfplus') {
      result.mime     = 'PDFPLUS';
      result.rtype    = 'ARTICLE';
    } else {
      result.rtype    = 'ARTICLE';
    }


    result.title_id = match[4] ;
    //see the comment block above
    result.unitid =result.doi  = match[2] + '/' + match[3];
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4,5})\/([0-9]+)$/.exec(path)) !== null) {
  //  http://www.emeraldinsight.com/doi/pdfplus/10.1108/14601061211272358

    if (match[1] === 'abs') {
      result.rtype    = 'ABS';
      result.mime     = 'MISC';
    } else if (match[1] === 'full') {
      result.mime     = 'HTML';
      result.rtype    = 'ARTICLE';
    } else if (match[1] === 'pdfplus') {
      result.mime     = 'PDFPLUS';
      result.rtype    = 'ARTICLE';
    } else {
      result.rtype    = 'ARTICLE';
    }


    result.title_id = match[3] ;
    //see the comment block above
    result.unitid =result.doi  = match[2] + '/' + match[3];
  }

  return result;
});

