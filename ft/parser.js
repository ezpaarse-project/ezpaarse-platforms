#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Financial Times
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/cms\/([a-z]+)\/([0-9]+)\/([0-9a-z-]+).html$/i.exec(path)) !== null) {
    ///cms/s/0/0b4a4790-6454-11e6-8310-ecf0bddad227.html#axzz4HgTPkTq0
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[3];

  } else if ((match = /^\/([0-9]+)\/([a-z-]+)\/([a-z-]+)$/i.exec(path)) !== null) {
    //5088258522001/Market-Minute-Federal-Reserve-in-focus/Editors-Choice
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([0-9]+)\/([a-z-]+)\/?$/i.exec(path)) !== null) {
    //2016/08/18/2172893/juicing-the-numbers-is-ok-if-youre-in-silicon-valley-apparently/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[4];
    result.unitid   = match[5];
    result.publication_date = match[1];

  } else if ((match = /^\/Olive\/([A-Z]+)\/([a-zA-Z]+)\/?$/i.exec(path)) !== null) {
    //h/Olive/ODE/FTePaperUK/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  } else if ((match = /^\/data\/([a-z]+)\/dashboard$/i.exec(path)) !== null) {
    //data/portfolio/dashboard
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';

  } else if ((match = /^\/reports\/([a-z-]+)$/i.exec(path)) !== null) {
    //reports/emerging-voices
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/content\/([a-z]+)\/([0-9a-z-]+).pdf$/i.exec(path)) !== null) {
    //content/images/0b5de310-6b56-11e5-8171-ba1968cf791a.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid   = match[2];

  } else if ((match = /^\/businessschoolrankings\/([a-z-]+)\/(([a-z-]+)([0-9]+))$/i.exec(path)) !== null) {
    //businessschoolrankings/mcgill-university/global-mba-ranking-2016#global-mba-ranking-2016
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.publication_date = match[4];
  }
  return result;
});
