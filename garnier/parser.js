#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Garnier Numérique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};


  if (path === '/numerique-bases/index.php') {
    // /numerique-bases/index.php?module=App&action=PanelText&link=jmp_article_17%09-A-%0A
    // /numerique-bases/index.php?module=App&action=PanelTabmat&link=jmp_tabmat__tmxa_007

    switch (param.action) {
    case 'PanelTabmat':
      result.rtype = 'TOC';
      result.mime  = 'HTML';

      if (param.link) {
        result.unitid = param.link.replace(/\s+/g, '');
      }

      break;
    case 'PanelText':
    case 'WindowText':
      if (param.link && param.link.startsWith('jmp_article')) {
        result.rtype  = 'ARTICLE';
        result.mime   = 'HTML';
        result.unitid = param.link.replace(/\s+/g, '');
      }
      break;
    }

  } else if (path === '/doi/article-pdf') {
    // /doi/article-pdf?article=HpeMS02_9

    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    if (param.article) {
      result.unitid = param.article;
    }
  }

  return result;
});
