#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Garnier Numérique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;


  if (param && param.link) {
    var cleanlink = param.link.replace(/\s+/g, '');
    var type = cleanlink.split('_');
    switch (type[1]) {
    case 'article':
    //numerique-bases/index.php?module=App&action=PanelText&link=jmp_article_17%09-A-%0A
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = cleanlink;
      break;
    case 'tabmat':
    //numerique-bases/index.php?module=App&action=PanelTabmat&link=jmp_tabmat__tmxa_007
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.unitid   = cleanlink;
      break;
    }
  } else if ((match = /^\/doi\/(([a-z]+)\-([a-z]+))?$/.exec(path)) !== null) {
    ///doi/article-pdf?article=HpeMS02_9
    if (match[3] === 'pdf') {
      result.mime     = 'PDF';
    }
    if (param && param.article) {
      result.rtype    = 'ARTICLE';
      result.unitid   = param.article;
    }

  }

  return result;
});

